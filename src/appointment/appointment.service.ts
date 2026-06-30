import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Appointment } from './appointment.entity';
import { StreamSlot } from './entity/stream-slot.entity';
import { Wave } from './entity/wave.entity';
import { WaveBooking } from './entity/wave-booking.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '../notifications/notification-type.enum';
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

  private readonly notificationService: NotificationService,
) {}

  // =====================================================
  // 🟢 DAY 8
  // =====================================================

async bookAppointment(dto: CreateAppointmentDto) {
  const appointmentDate = new Date(dto.date);

  if (isNaN(appointmentDate.getTime())) {
    return { message: 'Invalid date format' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  appointmentDate.setHours(0, 0, 0, 0);

  if (appointmentDate.getTime() !== today.getTime()) {
    return { message: "Booking allowed only for today's date" };
  }

  // 👇👇👇 PASTE THE DAY 19 CODE HERE 👇👇👇

 // ===============================
// DAY 19 - Appointment Booking Window
// ===============================

const consultationStart = new Date(`${dto.date}T09:00:00`);
const consultationEnd = new Date(`${dto.date}T12:00:00`);

if (
  isNaN(consultationStart.getTime()) ||
  isNaN(consultationEnd.getTime())
) {
  return {
    message: 'Invalid consultation timings',
  };
}

if (consultationStart >= consultationEnd) {
  return {
    message: 'Invalid consultation timings',
  };
}

const bookingOpen = new Date(consultationStart);
bookingOpen.setHours(bookingOpen.getHours() - 2);

const bookingClose = new Date(consultationEnd);
bookingClose.setHours(bookingClose.getHours() - 1);

const now = new Date();

if (now < bookingOpen) {
  return {
    message: 'Booking has not opened yet.',
  };
}

if (now > bookingClose) {
  return {
    message: 'Booking window has closed.',
  };
}
  // 👇 Existing slot check starts here
 const existing = await this.appointmentRepository.findOne({
  where: {
    doctorId: dto.doctorId,
    date: dto.date,
    startTime: dto.startTime,
    status: 'BOOKED',
  },
 });

if (existing) return { message: 'Slot already booked' };


  // continue with save appointment...
 await this.appointmentRepository.findOne({
    where: {
      doctorId: dto.doctorId,
      date: dto.date,
      startTime: dto.startTime,
      status: 'BOOKED',
    },
  });

   return { message: 'Slot already booked' };

  const appointment = this.appointmentRepository.create(dto);
  const saved = await this.appointmentRepository.save(appointment);

  await this.notificationService.create({
    patientId: saved.patientId,
    title: 'Appointment Booked',
    message: `Your appointment has been booked successfully for ${saved.date} at ${saved.startTime}`,
    type: NotificationType.APPOINTMENT_BOOKED,
  });

  return {
    message: 'Appointment booked successfully',
    data: saved,
  };

     await this.appointmentRepository.findOne({
      where: {
        doctorId: dto.doctorId,
        date: dto.date,
        startTime: dto.startTime,
        status: 'BOOKED',
      },
    });

    if (existing) return { message: 'Slot already booked' };

this.appointmentRepository.create(dto);
await this.appointmentRepository.save(appointment);

await this.notificationService.create({
  patientId: saved.patientId,
  title: 'Appointment Booked',
  message: `Your appointment has been booked successfully for ${saved.date} at ${saved.startTime}`,
  type: NotificationType.APPOINTMENT_BOOKED,
});

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
  const appt = await this.appointmentRepository.findOne({
    where: { id },
  });

  if (!appt) {
    return { message: 'Not found' };
  }

  appt.status = 'CANCELLED';

  const updated = await this.appointmentRepository.save(appt);

  await this.notificationService.create({
    patientId: updated.patientId,
    title: 'Appointment Cancelled',
    message: `Your appointment scheduled on ${updated.date} at ${updated.startTime} has been cancelled.`,
    type: NotificationType.APPOINTMENT_CANCELLED,
  });

  return {
    message: 'Appointment cancelled successfully',
    data: updated,
  };
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
    waveId,
    patientId,
    tokenNumber: wave.bookedCount,
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

const updatedAppointment =
  await this.appointmentRepository.save(appointment);

await this.notificationService.create({

patientId: updatedAppointment.patientId,

title: 'Appointment Rescheduled',

message: `Your appointment has been rescheduled to ${updatedAppointment.date} at ${updatedAppointment.startTime}`,

type: NotificationType.APPOINTMENT_RESCHEDULED,

});

return {
  message: 'Appointment rescheduled successfully',
  data: updatedAppointment,
};
}
// =====================================================
// 🚀 DAY 13 - NEXT AVAILABLE APPOINTMENT
// =====================================================

async findNextAvailableAppointment(doctorId: number) {
  if (!doctorId || isNaN(doctorId)) {
    return {
      message: 'Invalid doctor ID',
    };
  }

  const streamSlots = await this.streamRepository.find({
    where: { doctorId },
  });

  const wave = await this.waveRepository.findOne({
  where: { doctorId },
});

  if (streamSlots.length === 0 && !wave) {
    return {
      message: 'Doctor unavailable',
    };
  }

  const today = new Date();
  const todayDate = today.toISOString().split('T')[0];

  const todayBooked =
    await this.appointmentRepository.count({
      where: {
        doctorId,
        date: todayDate,
        status: 'BOOKED',
      },
    });

  // STREAM CHECK
  if (
  streamSlots.length > 0 &&
  todayBooked < streamSlots.length
) {
  return {
    message: 'Slots available today',
    appointmentDate: todayDate,
    schedulingType: 'STREAM',
    availableSlots: streamSlots.length - todayBooked,
  };
} // ✅ THIS CLOSING BRACKET IS MUST

  // WAVE CHECK
  if (
    wave &&
    wave.bookedCount < wave.maxCapacity
  ) {
    return {
      message: 'Wave available today',
      appointmentDate: todayDate,
      schedulingType: 'WAVE',
      availableSlots:
        wave.maxCapacity - wave.bookedCount,
    };
  }

  // Search next 30 days
  for (let i = 1; i <= 30; i++) {
    const nextDate = new Date();
    nextDate.setDate(
      nextDate.getDate() + i,
    );

    const formattedDate =
      nextDate.toISOString().split('T')[0];

    const booked =
      await this.appointmentRepository.count({
        where: {
          doctorId,
          date: formattedDate,
          status: 'BOOKED',
        },
      });

    if (
  streamSlots.length > 0 &&
  todayBooked < streamSlots.length
) {
  return {
    message: 'Slots available today',
    appointmentDate: todayDate,
    schedulingType: 'STREAM',
    availableSlots: streamSlots.length - todayBooked,
  };
}
    if (
      wave &&
      wave.bookedCount <
        wave.maxCapacity
    ) {
      return {
        message:
          'Next available appointment found',
        appointmentDate:
          formattedDate,
        schedulingType:
          'WAVE',
        availableSlots:
          wave.maxCapacity -
          wave.bookedCount,
      };
    }
  }

  return {
  message:
    'No appointments available in the next 30 working days. Please try again later.',
}
};
}