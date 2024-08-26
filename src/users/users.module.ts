import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Users]),JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config:ConfigService) => {
      return {
        //global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions:{expiresIn:'1h'}
      };
    }
  })],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
