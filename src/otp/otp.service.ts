import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './otp.entity';
import { GetOtpDTO } from './dtos/get-otp.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>,
  ) {}

  async getOtp(otpObj: GetOtpDTO) {
    await this.otpRepo.delete({ phoneNumber: otpObj.phoneNumber });
    let otp: Otp = new Otp();
    otp.generateOTP();
    Object.assign(otp, otpObj);
    await this.otpRepo.save(otp);
    return otp;
  }

  async verifyOtp(otp: number) {
    let _otp = await this.otpRepo.findOne({ where: { otp } });

    if (!_otp) throw new NotFoundException('Incorrect OTP!');

    if (!_otp.isValid()) throw new BadRequestException('OTP exceed it\'s valid time!');

    _otp.getToken();

    await this.otpRepo.save(_otp);
  }
}
