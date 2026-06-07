import { Controller, Get } from '@nestjs/common';

@Controller('patient')
export class PatientController {
  @Get('profile')
  getProfile() {
    return {
      message: 'Patient Profile Access Granted',
    };
  }
}