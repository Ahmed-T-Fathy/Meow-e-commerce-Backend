import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDTO } from './dtos/create-coupon.dto';
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UUIDDTO } from 'src/dto/UUID-dto';
import { CouponsPaginationQueryDTO } from './dtos/coupons-pagination-query.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CouponDTO } from './dtos/coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Serialize(CouponDTO)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Post()
  async createCoupon(@Body() createObj: CreateCouponDTO) {
    return await this.couponsService.createCoupon(createObj);
  }

  @Serialize(CouponDTO)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Get('/:id')
  async getCoupon(@Param() paramObj: UUIDDTO) {
    return await this.couponsService.findCouponById(paramObj.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Delete('/:id')
  async deleteCoupon(@Param() paramObj: UUIDDTO) {
    return await this.couponsService.deleteCoupon(paramObj.id);
  }

//   @Serialize(CouponDTO)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Get()
  async getAllCouponsPaginated(@Query() queryObj: CouponsPaginationQueryDTO) {
    const page = queryObj?.page ? queryObj.page : 1;
    const limit = queryObj?.limit ? queryObj.limit : 10;

    return await this.couponsService.paginateCoupons(
      {
        page,
        limit,
        route: 'coupons/',
      },
      queryObj,
    );
  }
}
