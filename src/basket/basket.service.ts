import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from './basket.entity';
import { LessThan, Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { Cron } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';
import { CouponsService } from 'src/coupons/coupons.service';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { CouponType } from 'src/coupons/coupon-type.enum';
import { Coupon } from 'src/coupons/coupon.entity';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket) private basketRepo: Repository<Basket>,
    private readonly mailService: MailService,
    private readonly couponsService: CouponsService,
  ) {}

  private async createBasket(user: Users): Promise<Basket> {
    const basket = await this.basketRepo
      .createQueryBuilder()
      .insert()
      .into('basket')
      .values({
        user,
      })
      .returning('*')
      .execute();
    return basket.raw[0];
  }

  async getBasket(user: Users): Promise<Basket> {
    const user_id = user.id;

    let basket = await this.basketRepo.findOne({
      where: { user: { id: user_id } },
    });

    if (!basket) basket = await this.createBasket(user);

    return basket;
  }

  async getBasketById(id: string): Promise<Basket> {
    const basket = await this.basketRepo.findOne({ where: { id } });
    if (!basket) throw new NotFoundException('Basket not found!');
    return basket;
  }

  async updateBasketDateAndreminderFlag(id: string) {
    await this.getBasketById(id);
    await this.basketRepo.update(
      { id },
      { updated_at: (new Date()).toISOString(), reminder_sent: false },
    );
  }

  @Cron('*/10 * * * * *')
  async basketRemender() {
    try {
      // const now = new Date();
      // const hours = String(now.getHours()).padStart(2, '0');
      // const minutes = String(now.getMinutes()).padStart(2, '0');
      // const seconds = String(now.getSeconds()).padStart(2, '0');

      // console.log(
      //   `Hey, I am logging time now is: ${hours}:${minutes}:${seconds}`,
      // );

      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

      const afterOneWeek = new Date();
      afterOneWeek.setHours(afterOneWeek.getHours() + 7 * 24);

      const basketss = await this.basketRepo.find();
      
      const baskets = await this.basketRepo.find({
        where: {
          reminder_sent: false,
          updated_at: LessThan(twoHoursAgo),
        },
        relations: ['user'],
      });

      await Promise.all(
        baskets.map(async (basket) => {
          const coupon: Coupon = await this.couponsService.createCoupon({
            amount: 20,
            expiryDate: afterOneWeek,
            name: this.generateRandomString(),
            type: CouponType.precentage,
            usageLimit: 1,
          });
          // console.log(`coupon: ${coupon}`);
          // await this.mailService.sendExclusiveCouponToUser(
          //   coupon.name,
          //   basket.user.email,
          // );

          basket.reminder_sent = true;

          await this.basketRepo.save(basket);
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  private generateRandomString(length: number = 8): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
