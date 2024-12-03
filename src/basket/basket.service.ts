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

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket) private basketRepo: Repository<Basket>,
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
      { updated_at: new Date(), reminder_sent: false },
    );
  }

  // @Cron('*/10 * * * * *')
  // async basketRemender() {
  //   try {
  //     const now = new Date();
  //     const hours = String(now.getHours()).padStart(2, '0');
  //     const minutes = String(now.getMinutes()).padStart(2, '0');
  //     const seconds = String(now.getSeconds()).padStart(2, '0');

  //     console.log(
  //       `Hey, I am logging time now is: ${hours}:${minutes}:${seconds}`,
  //     );

  //     const oneHourAgo = new Date();
  //     oneHourAgo.setHours(oneHourAgo.getHours() - 1);

  //     const baskets = await this.basketRepo.find({
  //       where: {
  //         reminder_sent: false,
  //         updated_at: LessThan(oneHourAgo), // updated_at is older than one hour
  //       },
  //     });
  //     console.log(baskets);
      
  //   } catch (err) {
  //     throw new InternalServerErrorException(err);
  //   }
  // }
}
