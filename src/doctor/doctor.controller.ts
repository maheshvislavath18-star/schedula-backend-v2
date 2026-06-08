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
  @Post('test')
  @UseGuards(JwtAuthGuard)
  test(@Req() req) {
    return req.user;
  }

  @Post('profile')
createProfile(@Body() dto: CreateDoctorProfileDto) {
  return this.doctorService.createProfile(dto, { id: 1 });
}

  // GET PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    console.log('GET USER:', req.user);

    if (!req.user?.id) {
      throw new ForbiddenException('Invalid token user');
    }

    if (req.user.role !== 'DOCTOR') {
      throw new ForbiddenException('Only doctors can view profile');
    }

    return this.doctorService.getProfile();
  }

  // UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Patch('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: CreateDoctorProfileDto,
    @Req() req,
  ) {
    console.log('PATCH USER:', req.user);

    if (!req.user?.id) {
      throw new ForbiddenException('Invalid token user');
    }

    if (req.user.role !== 'DOCTOR') {
      throw new ForbiddenException('Only doctors can update profile');
    }

    return this.doctorService.updateProfile(Number(id), dto);
  }
}