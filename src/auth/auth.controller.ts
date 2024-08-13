import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { LoginDataDTO } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signup')
  async signUp(@Body() data: CreateUserDTO){
    return await this.authService.signup(data);
  }

  @Post('login')
  async login(@Body() data:LoginDataDTO){    
    return await this.authService.login(data);
  }
}
