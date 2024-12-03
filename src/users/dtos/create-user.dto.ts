import {
    IsBoolean,
  IsEmail,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from '../roles.enum';
import { PricingV1VoiceVoiceCountryInstanceInboundCallPrices } from 'twilio/lib/rest/pricing/v1/voice/country';
import { Transform } from 'class-transformer';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' || value === 'false' ? value === 'true' : value,
  )
  is_verified: boolean;
}
