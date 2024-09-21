import {
  Controller,
  ForbiddenException,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { Role } from 'src/users/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGaurd } from 'src/auth/guards/auth.guard';

@Controller('basket')
export class BasketController {
  constructor(private basketService: BasketService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGaurd)
  @Get()
  async getBasket(@Request() req) {
    const user = req.user;
    if (!user) throw new ForbiddenException('there is no user in the request');

    return await this.basketService.getBasket(user);
    // return "OK"
  }
}
