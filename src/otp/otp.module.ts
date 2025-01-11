import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './otp.entity';
import { PhoneExistRole } from './custom-validators/phone-number-exist.validator';
import { UsersModule } from 'src/users/users.module';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    TypeOrmModule.forFeature([Otp]),
    SmsModule,
  ],
  providers: [OtpService, PhoneExistRole],
  controllers: [OtpController],
  exports:[OtpService]
})
export class OtpModule {}
