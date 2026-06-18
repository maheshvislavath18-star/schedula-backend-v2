import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common';

import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  // ✅ 1. Book Appointment
  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.bookAppointment(dto);
  }

  // ✅ 2. Patient Appointments
  @Get('my')
  getMyAppointments(@Query('patientId') patientId: number) {
    return this.appointmentService.getMyAppointments(
      Number(patientId),
    );
  }

  // 👨‍⚕️ 3. Doctor Appointments (NEW)
  @Get('doctor')
  getDoctorAppointments(@Query('doctorId') doctorId: number) {
    return this.appointmentService.getDoctorAppointments(
      Number(doctorId),
    );
  }

  // ❌ 4. Cancel Appointment (NEW)
  @Patch(':id/cancel')
  cancelAppointment(@Param('id') id: number) {
    return this.appointmentService.cancelAppointment(
      Number(id),
    );
  }
}