import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  doctorId!: number;

  @Column()
  leaveDate!: string;

  @Column({
    nullable: true,
  })
  reason!: string;
}