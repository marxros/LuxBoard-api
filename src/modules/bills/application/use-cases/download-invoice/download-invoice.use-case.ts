import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { BillRepository } from '@/modules/bills/domain/repositories/bill.repository';

@Injectable()
export class DownloadInvoiceUseCase {
  constructor(
    @Inject('BillRepository')
    private readonly billRepo: BillRepository,
  ) {}

  async execute(id: string): Promise<string> {
    const bill = await this.billRepo.findById(id);
    if (!bill || !bill.filePath)
      throw new NotFoundException('Fatura não encontrada.');
    const filePath = path.resolve('uploads/invoices', bill.filePath);
    if (!fs.existsSync(filePath))
      throw new NotFoundException('Arquivo não encontrado.');
    return filePath;
  }
}
