import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './otp.entity';
import { GetOtpDTO } from './dtos/get-otp.dto';
import { NotFoundError } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { SmsService } from 'src/sms/sms.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>,
    private readonly userService: UsersService,
    private readonly smsService: SmsService,
  ) {}

  async getOtp(otpObj: GetOtpDTO) {
    throw new BadRequestException('otp is service is not available!');
    const user = await this.userService.getUserByEmail(otpObj.email);

    await this.otpRepo.delete({ phoneNumber: user.phone });
    console.log(user);
    let otp: Otp = new Otp();

    await otp.generateOTP();

    otp.phoneNumber = user.phone;

    await this.smsService.sendOtpOurSMS(user.phone, otp.otp);

    await this.otpRepo.save(otp);

    return otp;
  }

  async verifyOtp(otp: number) {
    throw new BadRequestException('otp is service is not available!');

    let _otp = await this.otpRepo.findOne({ where: { otp } });

    if (!_otp) throw new NotFoundException('Incorrect OTP!');

    if (!_otp.isValid())
      throw new BadRequestException("OTP exceed it's valid time!");

    _otp.getToken();

    return await this.otpRepo.save(_otp);
  }

  async verifyToken(token: string) {
    try {
      throw new BadRequestException('otp is service is not available!');

      let _otp = await this.otpRepo.findOne({ where: { token } });

      if (!_otp.isValidToken()) {
        throw new BadRequestException("Token exceed it's valid time!");
      }

      return await this.userService.verifyMe(_otp.phoneNumber);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
