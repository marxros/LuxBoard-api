import { Test, TestingModule } from '@nestjs/testing';
import { CreateBillUseCase } from './create-bill.use-case.service';

describe('CreateBillService', () => {
  let service: CreateBillUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateBillUseCase],
    }).compile();

    service = module.get<CreateBillUseCase>(CreateBillUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
