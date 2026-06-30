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

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.bookAppointment(dto);
  }

  @Get('my')
  getMyAppointments(@Query('patientId') patientId: string) {
    return this.appointmentService.getMyAppointments(
      Number(patientId),
    );
  }

  @Get('doctor')
  getDoctorAppointments(@Query('doctorId') doctorId: string) {
    return this.appointmentService.getDoctorAppointments(
      Number(doctorId),
    );
  }

  @Patch(':id/cancel')
  cancelAppointment(@Param('id') id: string) {
    return this.appointmentService.cancelAppointment(
      Number(id),
    );
  }

  @Patch(':id/reschedule')
  rescheduleAppointment(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.appointmentService.rescheduleAppointment(
      Number(id),
      body,
    );
  }

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

  @Post('wave/book')
bookWave(@Body() body: any) {
  const waveId = Number(body.waveId);
  const patientId = Number(body.patientId);

  if (!waveId || !patientId || isNaN(waveId) || isNaN(patientId)) {
    return {
      message: 'waveId and patientId must be valid numbers',
    };
  }

  return this.appointmentService.bookWave({
    waveId,
    patientId,
  });
}

  @Get('stream/:doctorId')
  getStreamSlots(
    @Param('doctorId') doctorId: string,
  ) {
    return this.appointmentService.getStreamSlots(
      Number(doctorId),
    );
  }

  @Get('wave/:doctorId')
  getWaveInfo(
    @Param('doctorId') doctorId: string,
  ) {
    return this.appointmentService.getWaveInfo(
      Number(doctorId),
    );
  }

  @Get('doctor/:doctorId/next-available')
  findNextAvailable(
    @Param('doctorId') doctorId: string,
  ) {
    return this.appointmentService.findNextAvailableAppointment(
      Number(doctorId),
    );
  }
}