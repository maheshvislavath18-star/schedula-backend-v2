import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from 'typeorm';

import { DoctorProfile } from '../../doctor/entities/doctor-profile.entity';
import { PatientProfile } from '../../patient/entities/patient-profile.entity';

export enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role!: UserRole;

  // ✅ DOCTOR RELATION (SAFE)
  @OneToOne(() => DoctorProfile, (doctor) => doctor.user, {
    cascade: true,
    nullable: true,
  })
  doctorProfile?: DoctorProfile;

  // ✅ PATIENT RELATION (SAFE)
  @OneToOne(() => PatientProfile, (patient) => patient.user, {
    cascade: true,
    nullable: true,
  })
  patientProfile?: PatientProfile;
}