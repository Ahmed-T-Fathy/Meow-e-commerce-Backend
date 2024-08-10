import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { Role } from 'src/users/roles.enum';
import { Users } from 'src/users/users.entity';
import { DeepPartial, Repository } from 'typeorm';
import { LoginDataDTO } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Users) private usersRepo: Repository<Users>) {}

  async signup(data: CreateUserDTO) {
    const user = await this.usersRepo.find({
      where: { email: data.email, phone: data.phone},
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
      where: { email: data.email },
    });
    if (!user) throw new UnauthorizedException('Invalid email or password!');
    
    if (!user.is_verified) throw new UnauthorizedException('you are not verified!');
    
    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password!');
    }
    return { token: await user.generateToken() };
  }
}
