import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

import { RecurringAvailability } from './entities/recurring-availability.entity';
import { CustomAvailability } from './entities/custom-availability.entity';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([
    RecurringAvailability,
    CustomAvailability,
  ]),
  AppointmentModule,
],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AvailabilityModule {}