import { Test, TestingModule } from '@nestjs/testing';
import { CreateBillUseCase } from './create-bill.use-case';
import { BillRepository } from '@/modules/bills/domain/repositories/bill.repository';
import { Bill } from '@/modules/bills/domain/entities/bill.entity';

describe('CreateBillUseCase', () => {
  let useCase: CreateBillUseCase;
  let billRepository: BillRepository;

  const mockBillRepository: BillRepository = {
    create: jest.fn(),
    findMany: jest.fn(),
    findByClient: jest.fn(),
    findByClientAndMonth: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBillUseCase,
        {
          provide: 'BillRepository',
          useValue: mockBillRepository,
        },
      ],
    }).compile();

    useCase = module.get(CreateBillUseCase);
    billRepository = module.get('BillRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma fatura corretamente com valores derivados', async () => {
    const billData = {
      clientId: 'client-123',
      referenceMonth: new Date('2024-09-01'),
      energiaEletricaKwh: 100,
      energiaEletricaValor: 200,
      energiaSceeKwh: 50,
      energiaSceeValor: 150,
      energiaCompensadaKwh: 30,
      energiaCompensadaValor: -120,
      contribIlumPublicaValor: 30,
      filePath: '/caminho/fatura.pdf',
    };

    await useCase.execute(billData);

    expect(billRepository.create).toHaveBeenCalledWith(expect.any(Bill));

    const billCreated = (billRepository.create as jest.Mock).mock.calls[0][0];

    expect(billCreated.consumoTotal).toBe(150); // 100 + 50
    expect(billCreated.valorTotalSemGD).toBe(380); // 200 + 150 + 30
    expect(billCreated.economiaGD).toBe(-120);
    expect(billCreated.filePath).toBe('/caminho/fatura.pdf');
  });
});
