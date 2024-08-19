import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token is requried!');
    }
    try {

      const payload = await this.jwtService.verify(token);
      // console.log(payload);

      if (!payload) throw new UnauthorizedException('In valid token!');
      // console.log(token);
      // console.log(payload);
      // console.log(this.config.get<string>('jwt_secret'));
      const user = await this.userService.findUserById(payload.userId);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  private extractTokenFromHeader(request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
