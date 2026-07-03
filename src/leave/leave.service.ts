import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Leave } from './entities/leave.entity';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Appointment } from '../appointment/appointment.entity';

@Injectable()
export class LeaveService {
  constructor(
  @InjectRepository(Leave)
  private readonly leaveRepository: Repository<Leave>,

  @InjectRepository(Appointment)
  private readonly appointmentRepository: Repository<Appointment>,
) {}
  async create(createLeaveDto: CreateLeaveDto) {
    // Past Date Validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leaveDate = new Date(createLeaveDto.leaveDate);
    leaveDate.setHours(0, 0, 0, 0);

    if (leaveDate < today) {
      return {
        message: 'Past leave date is not allowed',
      };
    }

    // Duplicate Leave Validation
    const existingLeave = await this.leaveRepository.findOne({
      where: {
        doctorId: createLeaveDto.doctorId,
        leaveDate: createLeaveDto.leaveDate,
      },
    });

    if (existingLeave) {
      return {
        message: 'Leave already exists for this date',
      };
    }

    // Save Leave
    const leave = this.leaveRepository.create(createLeaveDto);

    await this.leaveRepository.save(leave);

    return {
      message: 'Doctor leave created successfully',
      data: leave,
    };
  }

  async findAll() {
    return await this.leaveRepository.find();
  }

  async findOne(id: number) {
    return await this.leaveRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateLeaveDto: UpdateLeaveDto) {
    await this.leaveRepository.update(id, updateLeaveDto);

    return {
      message: 'Doctor leave updated successfully',
    };
  }

  async remove(id: number) {
    await this.leaveRepository.delete(id);

    return {
      message: 'Doctor leave deleted successfully',
    };
  }
}