import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentModule } from './appointment/appointment.module';
import { NotificationModule } from './notifications/notification.module';
import { ReminderModule } from './reminder/reminder.module';
import { LeaveModule } from './leave/leave.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,

      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),

    UsersModule,
    AuthModule,
    DoctorModule,
    PatientModule,
    AvailabilityModule,
    AppointmentModule,
    NotificationModule,
    ReminderModule,
    LeaveModule,
  ],
})
export class AppModule {}