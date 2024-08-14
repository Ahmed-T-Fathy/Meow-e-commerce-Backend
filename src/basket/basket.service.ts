import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from './basket.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';

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
}
