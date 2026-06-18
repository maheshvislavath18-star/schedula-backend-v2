import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WaveBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  waveId: number;

  @Column({ type: 'int' })
  patientId: number;

  @Column({ type: 'int' })
  tokenNumber: number;
}