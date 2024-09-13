import { Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {

    constructor(private readonly otpService:OtpService){}
    @Post('send')
    async sendOtp(): Promise<void>{
        await this.otpService.sendOtpOurSMS('+20 111 345 1800', 'kosmak');
    }
}
