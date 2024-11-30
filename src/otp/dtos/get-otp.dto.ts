import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { isPhoneExist } from '../custom-validators/phone-number-exist.validator';
import { Type } from 'class-transformer';

export class GetOtpDTO {
  @IsNotEmpty()
  @IsEmail()
  @Type(()=>String)
  email: string;
}
