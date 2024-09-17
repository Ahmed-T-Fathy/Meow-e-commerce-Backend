import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCouponDTO } from './dtos/create-coupon.dto';
import { CouponType } from './coupon-type.enum';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { CouponsPaginationQueryDTO } from './dtos/coupons-pagination-query.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepo: Repository<Coupon>,
  ) {}

  async createCoupon(createObj: CreateCouponDTO): Promise<Coupon> {
    try {
      const createdCoupon = await this.couponRepo.create(createObj);
      if (createObj.amount > 100 && createObj.type === CouponType.precentage) {
        throw new ConflictException("you can't put precentage more than 100%");
      }
      return await this.couponRepo.save(createdCoupon);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findCouponById(id: string): Promise<Coupon> {
    try {
      const coupon = await this.couponRepo.findOne({
        where: { id },
      });
      if (!coupon) throw new NotFoundException('Coupon not found!');
      return coupon;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getCouponById(id: string): Promise<Coupon> {
    return await this.findCouponById(id);
  }

  async deleteCoupon(id: string): Promise<void> {
    const coupon = await this.findCouponById(id);
    await this.couponRepo.remove(coupon);
  }

  async paginateCoupons(
    options: IPaginationOptions,
    other: CouponsPaginationQueryDTO,
  ): Promise<Pagination<Coupon>> {
    try {
      const queryBuilder = this.couponRepo.createQueryBuilder('c');
      if (other?.orderBy) {
        other.orderBy.forEach((orderBy) => {
          queryBuilder.addOrderBy(`c.${orderBy.field}`, orderBy.direction);
        });
      }
      if (other?.name) {
        queryBuilder.andWhere('c.name LIKE :name', { name: `%${other.name}%` });
      }
    //   if (other?.expiryDate) {
    //     queryBuilder.andWhere('c.expiry_date LIKE :expiryDate', { expiryDate: `%${other.expiryDate}%` });

    //   }
      if (other?.type) {
        queryBuilder.andWhere('c.type = :type',{type:`${other.type}`});
      }

      return await paginate<Coupon>(queryBuilder, options);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
