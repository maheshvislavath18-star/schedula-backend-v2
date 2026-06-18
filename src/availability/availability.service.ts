import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecurringAvailability } from './entities/recurring-availability.entity';
import { CustomAvailability } from './entities/custom-availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateOverrideDto } from './dto/create-override.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(RecurringAvailability)
    private readonly recurringRepo: Repository<RecurringAvailability>,

    @InjectRepository(CustomAvailability)
    private readonly customRepo: Repository<CustomAvailability>,
  ) {}

  async getAllRecurring() {
    return this.recurringRepo.find();
  }

  async createAvailability(dto: CreateAvailabilityDto) {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(
        'Start time must be before end time',
      );
    }

    const existing = await this.recurringRepo.findOne({
      where: {
        doctorId: 1,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Availability already exists',
      );
    }

    const slots = await this.recurringRepo.find({
      where: {
        doctorId: 1,
        dayOfWeek: dto.dayOfWeek,
      },
    });

    for (const slot of slots) {
      const overlap =
        dto.startTime < slot.endTime &&
        dto.endTime > slot.startTime;

      if (overlap) {
        throw new ConflictException(
          'Time slot overlaps with existing slot',
        );
      }
    }

    const availability = this.recurringRepo.create({
      doctorId: 1,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    return this.recurringRepo.save(availability);
  }

  async createOverride(dto: CreateOverrideDto) {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(
        'Start time must be before end time',
      );
    }

    const availability = this.customRepo.create({
      doctorId: 1,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    return this.customRepo.save(availability);
  }

  async getAvailabilityByDate(date: string) {
    const custom = await this.customRepo.find({
      where: { date },
    });

    if (custom.length > 0) {
      return custom;
    }

    return [];
  }
}