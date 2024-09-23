import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { isPhoneExist } from '../custom-validators/phone-number-exist.validator';
import { Type } from 'class-transformer';

export class GetOtpDTO {
  @IsNotEmpty()
  @IsPhoneNumber()
  @Type(()=>String)
  // @isPhoneExist()
  phoneNumber: string;
}
