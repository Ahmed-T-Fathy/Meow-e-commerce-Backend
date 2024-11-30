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
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReturnOTPTokenDTO } from './dtos/return-otp-token.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/send')
  getOtp(@Body() bodyObj: GetOtpDTO) {
    console.log(bodyObj);

    return this.otpService.getOtp(bodyObj);
  }

  @Serialize(ReturnOTPTokenDTO)
  @Get('/:otp')
  verifyOtp(@Param() paramObj: VerifyOtpDTO) {
    return this.otpService.verifyOtp(paramObj.otp);
  }

  @Post('/twilio-status-callback')
  handleStatusCallback(@Body() body: any) {
    console.log('Status Callback:', body);
  }
}
