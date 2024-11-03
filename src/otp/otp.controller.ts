import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { GetOtpDTO } from './dtos/get-otp.dto';
import { VerifyOtpDTO } from './dtos/verify-otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  getOtp(@Body() bodyObj: GetOtpDTO) {
    console.log(bodyObj);

    return this.otpService.getOtp(bodyObj);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('/:otp')
  verifyOtp(@Param() paramObj: VerifyOtpDTO) {
    return this.otpService.verifyOtp(paramObj.otp)
  }
}
