import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Wave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctorId: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  maxCapacity: number;

  @Column({ default: 0 })
  bookedCount: number;
}