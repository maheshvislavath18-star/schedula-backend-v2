import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctorId: number;

  @Column()
  patientId: number;

  @Column()
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({
    default: 'BOOKED',
  })
  status: string;
}