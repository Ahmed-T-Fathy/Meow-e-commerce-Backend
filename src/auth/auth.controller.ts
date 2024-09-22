import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { LoginDataDTO } from './dtos/login.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGaurd } from './guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from 'src/users/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signup')
  async signUp(@Body() data: CreateUserDTO) {
    return await this.authService.signup(data);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login')
  async login(@Body() data: LoginDataDTO) {
    return await this.authService.login(data);
  }

  @Serialize(UserDTO)
  @UseGuards(AuthGaurd)
  @Get('me')
  async me(@Request() req) {
    return await this.usersService.findUserById(req.user.id);
  }
}
