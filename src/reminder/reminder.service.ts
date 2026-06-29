import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Appointment } from '../appointment/appointment.entity';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '../notifications/notification-type.enum';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAppointmentReminders() {
    this.logger.log('Checking appointment reminders...');

    const appointments = await this.appointmentRepository.find();

    const now = new Date();

    for (const appointment of appointments) {
      // Skip cancelled appointments
      if (appointment.status === 'CANCELLED') continue;

      // Skip completed appointments
      if (appointment.status === 'COMPLETED') continue;

      // Skip already reminded appointments
      if (appointment.reminderSent) continue;

      // Check reminder window (30 minutes before appointment)
      const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.startTime}`,
      );

      const diffMinutes =
        (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);

      if (diffMinutes > 30 || diffMinutes < 0) {
        continue;
      }

      // Stream Scheduling
      if (appointment.schedulingType === 'STREAM') {
        await this.notificationService.create({
          patientId: appointment.patientId,
          title: 'Appointment Reminder',
          message: `Reminder: You have an appointment today.

Doctor ID: ${appointment.doctorId}
Appointment Date: ${appointment.date}
Appointment Time: ${appointment.startTime}`,
          type: NotificationType.APPOINTMENT_REMINDER,
        });
      }

      // Wave Scheduling
      else if (appointment.schedulingType === 'WAVE') {
        await this.notificationService.create({
          patientId: appointment.patientId,
          title: 'Appointment Reminder',
          message: `Reminder: You have an appointment today.

Doctor ID: ${appointment.doctorId}
Reporting Time: ${appointment.startTime}
Token Number: ${appointment.tokenNumber}`,
          type: NotificationType.APPOINTMENT_REMINDER,
        });
      }

      // Mark reminder as sent
      appointment.reminderSent = true;
      await this.appointmentRepository.save(appointment);

      this.logger.log(
        `Reminder sent for Appointment ID: ${appointment.id}`,
      );
    }
  }
}