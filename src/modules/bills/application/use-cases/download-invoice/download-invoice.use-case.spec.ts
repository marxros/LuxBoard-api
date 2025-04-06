import { DownloadInvoiceUseCase } from './download-invoice.use-case';
import { NotFoundException } from '@nestjs/common';
import { BillRepository } from '@/modules/bills/domain/repositories/bill.repository';
import * as fs from 'fs';
import * as path from 'path';

// Mock manual do fs
jest.mock('fs');

describe('DownloadInvoiceUseCase', () => {
  let useCase: DownloadInvoiceUseCase;
  let mockBillRepository: jest.Mocked<BillRepository>;

  beforeEach(() => {
    mockBillRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findByClient: jest.fn(),
      findByClientAndMonth: jest.fn(),
      update: jest.fn(),
    } as any;

    useCase = new DownloadInvoiceUseCase(mockBillRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o caminho completo do arquivo se a fatura e o arquivo existirem', async () => {
    const billId = 'fatura-123';
    const fakeFilePath = 'arquivo.pdf';

    mockBillRepository.findById.mockResolvedValue({
      id: billId,
      filePath: fakeFilePath,
    } as any);

    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const result = await useCase.execute(billId);
    expect(result).toBe(path.resolve('uploads/invoices', fakeFilePath));
  });

  it('deve lançar NotFoundException se a fatura não for encontrada', async () => {
    mockBillRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('fatura-nao-existe')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar NotFoundException se o arquivo não existir', async () => {
    const billId = 'fatura-123';
    const fakeFilePath = 'arquivo-nao-existe.pdf';

    mockBillRepository.findById.mockResolvedValue({
      id: billId,
      filePath: fakeFilePath,
    } as any);

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await expect(useCase.execute(billId)).rejects.toThrow(NotFoundException);
  });
});
