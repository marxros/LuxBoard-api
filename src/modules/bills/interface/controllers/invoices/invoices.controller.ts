import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ProcessInvoiceUseCase } from '../../../application/use-cases/process-invoice/process-invoice.use-case';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly processInvoice: ProcessInvoiceUseCase) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@UploadedFiles() files: Multer.File[]) {
    const results = [];

    for (const file of files) {
      try {
        const { client, bill } = await this.processInvoice.execute(file.buffer);

        results.push({
          file: file.originalname,
          status: 'ok',
          result: {
            clientNumber: client.number,
            referenceMonth: this.formatDate(bill.referenceMonth),
            valorTotalSemGD: bill.valorTotalSemGD,
            economiaGD: bill.economiaGD,
          },
        });
      } catch (err) {
        results.push({
          file: file.originalname,
          status: 'error',
          message: err.message,
        });
      }
    }

    return results;
  }

  private formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${month}/${date.getFullYear()}`;
  }
}
