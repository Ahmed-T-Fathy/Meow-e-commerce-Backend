import { Test, TestingModule } from '@nestjs/testing';
import { TaxsService } from './taxs.service';

describe('TaxsService', () => {
  let service: TaxsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxsService],
    }).compile();

    service = module.get<TaxsService>(TaxsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
