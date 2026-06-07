import { Controller, Get } from '@nestjs/common';

@Controller('doctor')
export class DoctorController {
  @Get('profile')
  getProfile() {
    return {
      message: 'Doctor Profile Access Granted',
    };
  }
}