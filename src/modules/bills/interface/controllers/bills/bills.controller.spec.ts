// bills.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BillsController } from './bills.controller';
import { CreateBillUseCase } from '@/modules/bills/application/use-cases/create-bill/create-bill.use-case';
import { GetBillsUseCase } from '@/modules/bills/application/use-cases/get-bill/get-bills.use-case';
import { DownloadInvoiceUseCase } from '@/modules/bills/application/use-cases/download-invoice/download-invoice.use-case';
import { Response } from 'express';

describe('BillsController', () => {
  let controller: BillsController;

  const mockCreateBillUseCase = {
    execute: jest.fn(),
  };

  const mockGetBillsUseCase = {
    execute: jest.fn(),
  };

  const mockDownloadInvoiceUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillsController],
      providers: [
        { provide: CreateBillUseCase, useValue: mockCreateBillUseCase },
        { provide: GetBillsUseCase, useValue: mockGetBillsUseCase },
        {
          provide: DownloadInvoiceUseCase,
          useValue: mockDownloadInvoiceUseCase,
        },
      ],
    }).compile();

    controller = module.get<BillsController>(BillsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma fatura com sucesso', async () => {
    const body = {
      clientId: '123',
      referenceMonth: '2024-01-01',
      energiaEletricaKwh: 100,
      energiaEletricaValor: 200,
      energiaSceeKwh: 50,
      energiaSceeValor: 150,
      energiaCompensadaKwh: 30,
      energiaCompensadaValor: -100,
      contribIlumPublicaValor: 20,
      filePath: 'invoice.pdf',
    };

    const result = await controller.create(body as any);

    expect(mockCreateBillUseCase.execute).toHaveBeenCalledWith({
      ...body,
      referenceMonth: new Date('2024-01-01'),
    });

    expect(result).toEqual({ message: 'Fatura criada com sucesso.' });
  });

  it('deve retornar faturas', async () => {
    const query = { clientNumber: '123', month: '01/2024' };
    const fakeResult = [{ id: 'f1', clientName: 'Cliente X' }];
    mockGetBillsUseCase.execute.mockResolvedValue(fakeResult);

    const result = await controller.getBills(query as any);

    expect(mockGetBillsUseCase.execute).toHaveBeenCalledWith(query);
    expect(result).toEqual(fakeResult);
  });

  it('deve retornar um arquivo no download', async () => {
    const mockRes = {
      download: jest.fn(),
    } as any as Response;

    mockDownloadInvoiceUseCase.execute.mockResolvedValue('/path/to/file.pdf');

    await controller.download('abc123', mockRes);

    expect(mockDownloadInvoiceUseCase.execute).toHaveBeenCalledWith('abc123');
    expect(mockRes.download).toHaveBeenCalledWith('/path/to/file.pdf');
  });
});
