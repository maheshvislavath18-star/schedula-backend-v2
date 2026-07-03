import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

import { Appointment } from './appointment.entity';
import { StreamSlot } from './entity/stream-slot.entity';
import { Wave } from './entity/wave.entity';
import { WaveBooking } from './entity/wave-booking.entity';
import { RecurringAvailability } from '../availability/entities/recurring-availability.entity';
import { Leave } from '../leave/entities/leave.entity';

import { NotificationModule } from '../notifications/notification.module';
import { CustomAvailability } from '../availability/entities/custom-availability.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      StreamSlot,
      Wave,
      WaveBooking,
      RecurringAvailability,
       CustomAvailability,
      Leave,
    ]),
    NotificationModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],   // ✅ ADD THIS
})
export class AppointmentModule {}