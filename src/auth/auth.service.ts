import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { Role } from 'src/users/roles.enum';
import { Users } from 'src/users/users.entity';
import { DeepPartial, Repository } from 'typeorm';
import { LoginDataDTO } from './dtos/login.dto';
import { Roles } from './decorators/roles.decorator';
import { VerifyMeDTO } from './dtos/verify-me.dto';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    private readonly otpService: OtpService,
  ) {}

  async signup(data: CreateUserDTO) {
    const user = await this.usersRepo.find({
      where: [{ email: data.email }, { phone: data.phone }],
    });

    if (user.length !== 0)
      throw new ConflictException('This email or phone already in exist!');

    let createObj: DeepPartial<Users> = data as DeepPartial<Users>;
    createObj.role = Role.User;

    const createdUser = await this.usersRepo.create(createObj);

    await this.usersRepo.save(createdUser);
  }

  async login(data: LoginDataDTO) {
    const user = await this.usersRepo.findOne({
      where: [
        { email: data.email_phone }, 
        { phone: data.email_phone }, 
      ],
    });

    if (!user) throw new UnauthorizedException('Invalid email or phone number or password!');
    // user.is_verified=true;
    // user.role=Role.Admin;
    // await this.usersRepo.save(user);
    // console.log(user);

    // if (!user.is_verified)
    //   throw new UnauthorizedException('you are not verified!');

    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password!');
    }
    return { access_token: await user.generateToken() };
  }

  async verifyMe(data: VerifyMeDTO) {
    try {
      return await this.otpService.verifyToken(data.token);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
