import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('recurring_availability')
export class RecurringAvailability {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  doctorId!: number;

  @Column()
  dayOfWeek!: string;

  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  allowFutureBooking!: boolean;

  @Column({
    type: 'int',
    nullable: true,
  })
  maxFutureBookingDays!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}