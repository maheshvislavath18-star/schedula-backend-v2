import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class StreamSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctorId: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ default: false })
  isBooked: boolean;
}