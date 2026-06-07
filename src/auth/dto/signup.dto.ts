import { IsEnum, IsString, MinLength } from 'class-validator';

export class SignupDto {

  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['DOCTOR', 'PATIENT'])
  role: 'DOCTOR' | 'PATIENT';
}