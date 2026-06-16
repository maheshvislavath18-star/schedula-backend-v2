import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // ✅ 1. Book Appointment
  async bookAppointment(dto: CreateAppointmentDto) {
    // 🔥 improved duplicate check (also avoids cancelled confusion later)
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId: dto.doctorId,
        date: dto.date,
        startTime: dto.startTime,
        status: 'BOOKED',
      },
    });

    if (existingAppointment) {
      return {
        message: 'Slot already booked',
      };
    }

    const appointment = this.appointmentRepository.create({
      doctorId: dto.doctorId,
      patientId: dto.patientId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'BOOKED',
    });

    const saved = await this.appointmentRepository.save(appointment);

    return {
      message: 'Appointment booked successfully',
      data: saved,
    };
  }

  // ✅ 2. Patient Appointments
  async getMyAppointments(patientId: number) {
    const appointments = await this.appointmentRepository.find({
      where: {
        patientId,
      },
    });

    return {
      message: 'Appointments fetched successfully',
      data: appointments,
    };
  }

  // ✅ 3. Doctor Appointments (NEW)
  async getDoctorAppointments(doctorId: number) {
    const appointments = await this.appointmentRepository.find({
      where: {
        doctorId,
      },
    });

    return {
      message: 'Doctor appointments fetched successfully',
      data: appointments,
    };
  }

  // ✅ 4. Cancel Appointment (NEW)
  async cancelAppointment(id: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      return {
        message: 'Appointment not found',
      };
    }

    // already cancelled check (extra safety)
    if (appointment.status === 'CANCELLED') {
      return {
        message: 'Appointment already cancelled',
        data: appointment,
      };
    }

    appointment.status = 'CANCELLED';

    const updated = await this.appointmentRepository.save(appointment);

    return {
      message: 'Appointment cancelled successfully',
      data: updated,
    };
  }
}