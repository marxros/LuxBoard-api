import { LocalInvoiceStorageService } from '@/modules/bills/infra/storage/invoice-storage.service';
import { PrismaService } from '@/shared/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UploadInvoiceUseCase {
  constructor(
    private readonly uploadService: LocalInvoiceStorageService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(file: Buffer, billId: string, referenceMonth: string) {
    const filePath = await this.uploadService.save(
      file,
      billId,
      referenceMonth,
    );

    const bill = await this.prisma.bill.findUnique({
      where: { id: billId },
    });

    if (!bill) throw new NotFoundException('Fatura (bill) não encontrada.');

    await this.prisma.bill.update({
      where: { id: billId },
      data: {
        filePath,
      },
    });
  }
}
