import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDataDTO {
  @IsNotEmpty()
  // @IsEmail()
  @IsString()
  @Type(() => String)
  email_phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
