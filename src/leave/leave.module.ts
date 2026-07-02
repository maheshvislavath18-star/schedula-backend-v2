import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Leave } from './entities/leave.entity';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';

import { Appointment } from '../appointment/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Leave,
      Appointment,
    ]),
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}