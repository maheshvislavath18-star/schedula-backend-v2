import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeaveDto {
  @IsInt()
  doctorId: number;

  @IsNotEmpty()
  @IsString()
  leaveDate: string;

  @IsOptional()
  @IsString()
  reason?: string;
}