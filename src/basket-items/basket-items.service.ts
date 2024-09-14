import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketItem } from './basket-item.entity';
import { Repository, DeepPartial } from 'typeorm';
import { BasketService } from './../basket/basket.service';
import { AddItemIntoBasketDTO } from './dtos/add-item-to-basket.dto';
import { UpdateBasketItemDTO } from './dtos/update-basket-item.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { BasketItemsPaginationQueryDTO } from './dtos/basket-items-pagination.dto';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
@Injectable()
export class BasketItemsService {
  constructor(
    @InjectRepository(BasketItem)
    private basketItemRepo: Repository<BasketItem>,
    private basketService: BasketService,
    private productVariantsService: ProductVariantsService,
  ) {}
  async AddItemToBasket(data: AddItemIntoBasketDTO) {
    const basket = await this.basketService.getBasketById(data.basket_id);
    const productVariant = await this.productVariantsService.getVariantById(
      data.product_variant_id,
    );
    const item: DeepPartial<BasketItem> = data as DeepPartial<BasketItem>;
    item.basket = basket;
    item.product_variant = productVariant;
    if (item.quantity < 1 || data.quantity > item.product_variant.stock)
      throw new BadRequestException(
        'Invalid Quantity it must be more than 1 and less than or equeal stock quantity!',
      );

    const itemFound = await this.basketItemRepo.findOne({
      where: {
        product_variant: { id: productVariant.id },
        basket: { id: basket.id },
      },
    });
    // console.log(itemFound);

    if (itemFound)
      throw new ConflictException(
        'This product is alread in basket just upadte its quntity',
      );

    const saved_basket = await this.basketItemRepo.save(item);
    await this.basketService.updateBasketDateAndreminderFlag(data.basket_id);
    return saved_basket;
  }
  async UpdateBasketItemQuntity(id: string, data: UpdateBasketItemDTO) {
    const item = await this.getBasketItemById(id);
    if (data.quantity < 1 || data.quantity > item.product_variant.stock) {
      throw new BadRequestException(
        'Invalid Quantity it must be more than 1 and less than or equeal stock quantity!',
      );
    }
    await this.basketService.updateBasketDateAndreminderFlag(item.basket?.id);

    return await this.basketItemRepo.update(
      { id },
      { quantity: data.quantity },
    );
  }

  async getBasketItemById(id: string) {
    const item = await this.basketItemRepo.findOne({
      where: { id },
      relations: [
        'basket',
        'product_variant',
        // 'product_variant.color',
        'product_variant.product',
      ],
    });
    if (!item) throw new NotFoundException("Basket's item not found!");
    return item;
  }

  async deleteBasketItem(id: string) {
    const item = await this.getBasketItemById(id);
    await this.basketService.updateBasketDateAndreminderFlag(item.basket?.id);
    await this.basketItemRepo.remove(item);
  }

  async paginateItems(
    options: IPaginationOptions,
    other: BasketItemsPaginationQueryDTO,
  ): Promise<Pagination<BasketItem>> {
    const queryBuilder = this.basketItemRepo.createQueryBuilder('b');
    if (other?.orderBy) {
      other.orderBy.forEach((orderBy) => {
        queryBuilder.addOrderBy(`b.${orderBy.field}`, orderBy.direction);
      });
    }

    if (other?.basket) {
      queryBuilder.andWhere('b.basket_id = :basket_id', {
        basket_id: other.basket,
      });
    }

    if (other?.product_variant) {
      queryBuilder.andWhere('b.product_variant_id = :product_variant_id', {
        product_variant_id: other.product_variant,
      });
    }
    return await paginate<BasketItem>(queryBuilder, options);
  }
}
