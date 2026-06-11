import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';

import { DoctorService } from './doctor.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // TEST JWT
  @UseGuards(JwtAuthGuard)
  @Post('test')
  test(@Req() req) {
    return req.user;
  }

  // CREATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  createProfile(@Body() dto: CreateDoctorProfileDto, @Req() req) {
    if (req.user.role !== 'DOCTOR') {
      throw new ForbiddenException('Only doctors allowed');
    }

    return this.doctorService.createProfile(dto, req.user);
  }

  // GET PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    if (!req.user?.id) {
      throw new ForbiddenException('Invalid token');
    }

    if (req.user.role !== 'DOCTOR') {
      throw new ForbiddenException('Only doctors can view profile');
    }

    // ✅ FIXED HERE
    return this.doctorService.getProfile(req.user.id);
  }

  // UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Patch('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: CreateDoctorProfileDto,
    @Req() req,
  ) {
    if (!req.user?.id) {
      throw new ForbiddenException('Invalid token');
    }

    if (req.user.role !== 'DOCTOR') {
      throw new ForbiddenException('Only doctors can update profile');
    }

    return this.doctorService.updateProfile(Number(id), dto);
  }
}