import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Appointment } from './appointment.entity';
import { StreamSlot } from './entity/stream-slot.entity';
import { Wave } from './entity/wave.entity';
import { WaveBooking } from './entity/wave-booking.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(StreamSlot)
    private streamRepository: Repository<StreamSlot>,

    @InjectRepository(Wave)
    private waveRepository: Repository<Wave>,

    @InjectRepository(WaveBooking)
    private waveBookingRepository: Repository<WaveBooking>,
  ) {}

  // =====================================================
  // 🟢 DAY 8
  // =====================================================

  async bookAppointment(dto: CreateAppointmentDto) {
    const existing = await this.appointmentRepository.findOne({
      where: {
        doctorId: dto.doctorId,
        date: dto.date,
        startTime: dto.startTime,
        status: 'BOOKED',
      },
    });

    if (existing) return { message: 'Slot already booked' };

    const appointment = this.appointmentRepository.create(dto);
    const saved = await this.appointmentRepository.save(appointment);

    return {
      message: 'Appointment booked successfully',
      data: saved,
    };
  }

  async getMyAppointments(patientId: number) {
    return {
      message: 'Fetched',
      data: await this.appointmentRepository.find({ where: { patientId } }),
    };
  }

  async getDoctorAppointments(doctorId: number) {
    return {
      message: 'Fetched',
      data: await this.appointmentRepository.find({ where: { doctorId } }),
    };
  }

  async cancelAppointment(id: number) {
    const appt = await this.appointmentRepository.findOne({ where: { id } });

    if (!appt) return { message: 'Not found' };

    appt.status = 'CANCELLED';
    return this.appointmentRepository.save(appt);
  }

  // =====================================================
  // 🚀 STREAM (REAL DB)
  // =====================================================

  async createStreamSchedule(doctorId: number, body: any) {
    const { startTime, endTime, slotDuration, bufferTime = 0 } = body;

    const slots = this.generateStreamSlots(
      startTime,
      endTime,
      slotDuration,
      bufferTime,
    );

    const savedSlots = slots.map((slot) =>
      this.streamRepository.create({
        doctorId,
        startTime: slot.start.toISOString(),
        endTime: slot.end.toISOString(),
      }),
    );

    await this.streamRepository.save(savedSlots);

    return {
      message: 'Stream schedule created',
      doctorId,
      type: 'STREAM',
      totalSlots: savedSlots.length,
    };
  }

  generateStreamSlots(
    start: string,
    end: string,
    duration: number,
    buffer: number,
  ) {
    const slots: { start: Date; end: Date }[] = [];

    let current = new Date(`2026-01-01T${start}:00`);
    const endTime = new Date(`2026-01-01T${end}:00`);

    while (current.getTime() + duration * 60000 <= endTime.getTime()) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + duration * 60000);

      slots.push({ start: slotStart, end: slotEnd });

      current = new Date(slotEnd.getTime() + buffer * 60000);
    }

    return slots;
  }

  async getStreamSlots(doctorId: number) {
    return {
      message: 'Stream slots fetched',
      data: await this.streamRepository.find({ where: { doctorId } }),
    };
  }

  // =====================================================
  // 🟡 WAVE (REAL DB + TOKEN SYSTEM)
  // =====================================================

  async createWaveSchedule(doctorId: number, body: any) {
    const wave = this.waveRepository.create({
      doctorId,
      startTime: body.startTime,
      endTime: body.endTime,
      maxCapacity: body.maxCapacity,
      bookedCount: 0,
    });

    const saved = await this.waveRepository.save(wave);

    return {
      message: 'Wave schedule created',
      data: saved,
    };
  }

async bookWave(body: any) {
  const waveId = Number(body.waveId);
  const patientId = Number(body.patientId);

  if (isNaN(waveId) || isNaN(patientId)) {
    return { message: 'Invalid input' };
  }

  const wave = await this.waveRepository.findOne({
    where: { id: waveId },
  });

  if (!wave) return { message: 'Wave not found' };

  if (wave.bookedCount >= wave.maxCapacity) {
    return { message: 'Wave Full' };
  }

  wave.bookedCount += 1;
  await this.waveRepository.save(wave);

  const booking = this.waveBookingRepository.create({
    waveId: Number(waveId),
    patientId: Number(patientId),
    tokenNumber: Number(wave.bookedCount),
  });

  await this.waveBookingRepository.save(booking);

  return {
    message: 'Wave booking successful',
    tokenNumber: wave.bookedCount,
  };
}

  async getWaveInfo(doctorId: number) {
  const wave = await this.waveRepository.findOne({
    where: { doctorId },
  });

  if (!wave) return { message: 'No wave found' };

  return {
    message: 'Wave info fetched',
    timeWindow: `${wave.startTime} - ${wave.endTime}`,
    maxCapacity: wave.maxCapacity,
    bookedCount: wave.bookedCount,
    available: wave.maxCapacity - wave.bookedCount,
  };
}

// =====================================================
// 🚀 DAY 10 RESCHEDULE
// =====================================================

async rescheduleAppointment(
  appointmentId: number,
  body: any,
) {
  const appointment = await this.appointmentRepository.findOne({
    where: { id: appointmentId },
  });

  if (!appointment) {
    return {
      message: 'Appointment not found',
    };
  }

  if (!body.newTime) {
    return {
      message: 'newTime is required',
    };
  }

  if (
    body.patientId &&
    appointment.patientId !== Number(body.patientId)
  ) {
    return {
      message:
        'Unauthorized: Only appointment owner can reschedule',
    };
  }

  if (appointment.status === 'CANCELLED') {
    return {
      message: 'Cannot reschedule cancelled appointment',
    };
  }

  const appointmentDateTime = new Date(
    `${appointment.date}T${appointment.startTime}`,
  );

  const now = new Date();

  const diffMinutes =
    (appointmentDateTime.getTime() - now.getTime()) /
    (1000 * 60);

  if (diffMinutes < 30) {
    return {
      message:
        'Reschedule not allowed within 30 minutes of appointment',
    };
  }

  if (body.newTime === appointment.startTime) {
    const suggestedDate = new Date();
    suggestedDate.setHours(
      suggestedDate.getHours() + 1,
    );

    return {
      message: 'Cannot reschedule to the same time',
      suggestedTime: suggestedDate,
    };
  }

  const requestedTime = new Date(body.newTime);

  if (requestedTime <= new Date()) {
    const suggestedDate = new Date();
    suggestedDate.setDate(
      suggestedDate.getDate() + 1,
    );

    return {
      message: 'Cannot reschedule to a past time',
      suggestedTime: suggestedDate,
    };
  }

  appointment.startTime = body.newTime;

  await this.appointmentRepository.save(appointment);

  return {
    message: 'Appointment rescheduled successfully',
    data: appointment,
  };
}
}