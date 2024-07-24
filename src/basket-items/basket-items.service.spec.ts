import { Test, TestingModule } from '@nestjs/testing';
import { BasketItemsService } from './basket-items.service';

describe('BasketItemsService', () => {
  let service: BasketItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasketItemsService],
    }).compile();

    service = module.get<BasketItemsService>(BasketItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
