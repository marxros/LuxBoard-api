import { Test, TestingModule } from '@nestjs/testing';
import { ProcessInvoiceUseCase } from './process-invoice.use-case';
import { Bill } from '@/modules/bills/domain/entities/bill.entity';

describe('ProcessInvoiceUseCase', () => {
  let useCase: ProcessInvoiceUseCase;

  const mockClientRepo = {
    findByNumber: jest.fn(),
    create: jest.fn(),
  };

  const mockBillRepo = {
    findByClientAndMonth: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockStorage = {
    save: jest.fn(),
  };

  const mockParser = {
    parse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessInvoiceUseCase,
        { provide: 'InvoiceParser', useValue: mockParser },
        { provide: 'ClientRepository', useValue: mockClientRepo },
        { provide: 'BillRepository', useValue: mockBillRepo },
        { provide: 'InvoiceStorage', useValue: mockStorage },
      ],
    }).compile();

    useCase = module.get(ProcessInvoiceUseCase);
    jest.clearAllMocks();
  });

  it('deve criar um novo cliente e uma nova fatura com cálculos corretos', async () => {
    const buffer = Buffer.from('fake-pdf');
    mockParser.parse.mockResolvedValue({
      clientNumber: '12345',
      clientName: 'Cliente Teste',
      referenceMonth: 'ABR/2024',
      energiaEletricaKwh: 50,
      energiaEletricaValor: 100,
      energiaSceeKwh: 476,
      energiaSceeValor: 200,
      energiaCompensadaKwh: 456,
      energiaCompensadaValor: -150,
      contribIlumPublicaValor: 30,
    });

    mockClientRepo.findByNumber.mockResolvedValue(null);
    mockStorage.save.mockResolvedValue('12345-2024-04.pdf');
    mockBillRepo.findByClientAndMonth.mockResolvedValue(null);

    const result = await useCase.execute(buffer);

    expect(result.client.number).toBe('12345');
    expect(result.client.name).toBe('Cliente Teste');

    const bill = result.bill;

    expect(bill.energiaEletricaKwh).toBe(50);
    expect(bill.energiaSceeKwh).toBe(476);
    expect(bill.energiaCompensadaKwh).toBe(456);
    expect(bill.consumoTotal).toBe(526);

    expect(bill.energiaEletricaValor).toBe(100);
    expect(bill.energiaSceeValor).toBe(200);
    expect(bill.contribIlumPublicaValor).toBe(30);
    expect(bill.valorTotalSemGD).toBe(330);

    expect(bill.economiaGD).toBe(-150);
    expect(bill.filePath).toBe('12345-2024-04.pdf');

    expect(mockClientRepo.create).toHaveBeenCalled();
    expect(mockBillRepo.create).toHaveBeenCalledWith(expect.any(Bill));
  });
});
