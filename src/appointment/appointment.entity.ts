import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  // 👇 Doctor & Patient
  @Column()
  doctorId: number;

  @Column()
  patientId: number;

  // 👇 Common scheduling fields
  @Column()
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  // 👇 BOOKING STATUS
  @Column({
    default: 'BOOKED', // BOOKED | CANCELLED | COMPLETED
  })
  status: string;

  // =====================================================
  // 🧠 DAY 9 ADDITIONS (STREAM + WAVE SUPPORT)
  // =====================================================

  // STREAM or WAVE
  @Column({
    type: 'varchar',
    nullable: true,
  })
  schedulingType: 'STREAM' | 'WAVE';

  // =====================================================
  // 🔵 STREAM SCHEDULING FIELDS
  // =====================================================

  // slot duration in minutes (e.g., 15)
  @Column({
    nullable: true,
  })
  slotDuration: number;

  // buffer time between slots in minutes (e.g., 5)
  @Column({
    nullable: true,
  })
  bufferTime: number;

  // =====================================================
  // 🟡 WAVE SCHEDULING FIELDS
  // =====================================================

  // max patients allowed in wave
  @Column({
    nullable: true,
  })
  maxCapacity: number;

  // how many already booked
  @Column({
    nullable: true,
    default: 0,
  })
  bookedCount: number;

  // token number for patient (Wave only)
  @Column({
    nullable: true,
  })
  tokenNumber: number;

  // =====================================================
  // 🧠 OPTIONAL (GOOD FOR DEBUGGING / UI)
  // =====================================================

  // =====================================================
// 🧠 OPTIONAL (GOOD FOR DEBUGGING / UI)
// =====================================================

@Column({
  nullable: true,
})
scheduleWindow: string;

// =====================================================
// 🔔 DAY 17 - APPOINTMENT REMINDER
// =====================================================

@Column({
  default: false,
})
reminderSent: boolean;
}