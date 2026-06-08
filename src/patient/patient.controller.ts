import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { PatientService } from './patient.service';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // CREATE patient profile
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  createProfile(@Body() dto: CreatePatientProfileDto) {
    const mockUser = { id: 1 }; // temporary (we will remove later)
    return this.patientService.createProfile(dto, mockUser);
  }

  // GET patient profiles
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile() {
    return this.patientService.getProfile();
  }

  // UPDATE patient profile
  @UseGuards(JwtAuthGuard)
  @Patch('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: CreatePatientProfileDto,
  ) {
    return this.patientService.updateProfile(Number(id), dto);
  }
}