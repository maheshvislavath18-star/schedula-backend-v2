import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateOverrideDto } from './dto/create-override.dto';

@Controller('doctor/availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Get()
  getAll() {
    return this.availabilityService.getAllRecurring();
  }

  @Post()
  create(
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.createAvailability(dto);
  }

  @Post('override')
  createOverride(
    @Body() dto: CreateOverrideDto,
  ) {
    return this.availabilityService.createOverride(dto);
  }

  @Get('date')
  getByDate(
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailabilityByDate(date);
  }

  // DAY 7 - SLOT GENERATION
  @Get(':doctorId/slots')
  getDoctorSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('duration') duration?: string,
  ) {
    return this.availabilityService.getDoctorSlots(
      Number(doctorId),
      date,
      duration ? Number(duration) : 15,
    );
  }
}