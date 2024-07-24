import { Test, TestingModule } from '@nestjs/testing';
import { BasketItemsController } from './basket-items.controller';

describe('BasketItemsController', () => {
  let controller: BasketItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasketItemsController],
    }).compile();

    controller = module.get<BasketItemsController>(BasketItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
