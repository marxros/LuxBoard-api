import { Test, TestingModule } from '@nestjs/testing';
import { UploadInvoiceUseCase } from './upload-invoice.use-case';
import { PrismaService } from '@/shared/prisma.service';
import { LocalInvoiceStorageService } from '@/modules/bills/infra/storage/invoice-storage.service';
import { NotFoundException } from '@nestjs/common';

describe('UploadInvoiceUseCase', () => {
  let useCase: UploadInvoiceUseCase;
  let uploadService: LocalInvoiceStorageService;
  let prisma: PrismaService;

  const mockUploadService = {
    save: jest.fn(),
  };

  const mockPrismaService = {
    bill: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadInvoiceUseCase,
        {
          provide: LocalInvoiceStorageService,
          useValue: mockUploadService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    useCase = module.get(UploadInvoiceUseCase);
    uploadService = module.get(LocalInvoiceStorageService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('deve salvar o arquivo e atualizar a fatura com o path correto', async () => {
    const fileBuffer = Buffer.from('pdf-content');
    const billId = 'bill-123';
    const referenceMonth = '2024-04';

    mockUploadService.save.mockResolvedValue('bill-123-2024-04.pdf');
    mockPrismaService.bill.findUnique.mockResolvedValue({ id: billId });

    await useCase.execute(fileBuffer, billId, referenceMonth);

    expect(uploadService.save).toHaveBeenCalledWith(
      fileBuffer,
      billId,
      referenceMonth,
    );
    expect(prisma.bill.update).toHaveBeenCalledWith({
      where: { id: billId },
      data: { filePath: 'bill-123-2024-04.pdf' },
    });
  });

  it('deve lançar NotFoundException se a fatura não for encontrada', async () => {
    mockPrismaService.bill.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute(Buffer.from('file'), 'bill-notfound', '2024-04'),
    ).rejects.toThrow(NotFoundException);

    expect(prisma.bill.update).not.toHaveBeenCalled();
  });
});
