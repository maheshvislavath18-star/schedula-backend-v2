import { IsDateString } from 'class-validator';

export class GetSlotsDto {
  @IsDateString()
  date!: string;
}