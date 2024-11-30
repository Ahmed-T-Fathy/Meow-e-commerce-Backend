import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Users]), OtpModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [UsersModule],
})
export class AuthModule {}
