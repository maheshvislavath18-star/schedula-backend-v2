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

  // =====================================================
  // 🟢 DAY 8 APIs
  // =====================================================

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.bookAppointment(dto);
  }

  @Get('my')
  getMyAppointments(@Query('patientId') patientId: string) {
    return this.appointmentService.getMyAppointments(Number(patientId));
  }

  @Get('doctor')
  getDoctorAppointments(@Query('doctorId') doctorId: string) {
    return this.appointmentService.getDoctorAppointments(Number(doctorId));
  }

  @Patch(':id/cancel')
  cancelAppointment(@Param('id') id: string) {
    return this.appointmentService.cancelAppointment(Number(id));
  }

  // =====================================================
  // 🚀 DAY 9 APIs
  // =====================================================

  // 🔵 STREAM CREATE
  @Post('stream/:doctorId')
  createStream(
    @Param('doctorId') doctorId: string,
    @Body() body: any,
  ) {
    return this.appointmentService.createStreamSchedule(
      Number(doctorId),
      body,
    );
  }

  // 🟡 WAVE CREATE
  @Post('wave/:doctorId')
  createWave(
    @Param('doctorId') doctorId: string,
    @Body() body: any,
  ) {
    return this.appointmentService.createWaveSchedule(
      Number(doctorId),
      body,
    );
  }

  // 🟠 WAVE BOOK (SAFE FIX FOR POSTGRES ERROR)
  @Post('wave/book')
bookWave(@Body() body: any) {
  const waveId = Number(body.waveId);
  const patientId = Number(body.patientId);

  if (isNaN(waveId) || isNaN(patientId)) {
    return { message: 'Invalid waveId or patientId' };
  }

  return this.appointmentService.bookWave({
    waveId,
    patientId,
  });
}

  // 🟣 STREAM VIEW
  @Get('stream/:doctorId')
  getStreamSlots(@Param('doctorId') doctorId: string) {
    return this.appointmentService.getStreamSlots(Number(doctorId));
  }

  // 🟣 WAVE VIEW
  @Get('wave/:doctorId')
  getWaveInfo(@Param('doctorId') doctorId: string) {
    return this.appointmentService.getWaveInfo(Number(doctorId));
  }
}