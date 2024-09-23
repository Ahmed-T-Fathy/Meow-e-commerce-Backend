import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyOtpDTO {
  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  otp: number;
}
