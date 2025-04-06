import { Module } from '@nestjs/common';
import { BillsController } from './interface/controllers/bills/bills.controller';
import { PrismaService } from '@/shared/prisma.service';
import { CreateBillUseCase } from './application/use-cases/create-bill/create-bill.use-case';
import { BillPrismaRepository } from './infra/prisma/bill.prisma.repository';
import { InvoicesController } from './interface/controllers/invoices/invoices.controller';
import { PdfInvoiceParserService } from './infra/services/pdf-invoice-parser.service';
import { ProcessInvoiceUseCase } from './application/use-cases/process-invoice/process-invoice.use-case';
import { ClientPrismaRepository } from '../clients/infra/prisma/client.prisma.repository';
import { GetBillsUseCase } from './application/use-cases/get-bill/get-bills.use-case';
import { LocalInvoiceStorageService } from './infra/storage/invoice-storage.service';
import { DownloadInvoiceUseCase } from './application/use-cases/download-invoice/download-invoice.use-case';

@Module({
  controllers: [BillsController, InvoicesController],
  providers: [
    PrismaService,
    CreateBillUseCase,
    GetBillsUseCase,
    PdfInvoiceParserService,
    ProcessInvoiceUseCase,
    DownloadInvoiceUseCase,
    {
      provide: 'BillRepository',
      useClass: BillPrismaRepository,
    },
    {
      provide: 'ClientRepository',
      useClass: ClientPrismaRepository,
    },
    {
      provide: 'InvoiceParser',
      useClass: PdfInvoiceParserService,
    },
    {
      provide: 'InvoiceStorage',
      useClass: LocalInvoiceStorageService,
    },
  ],
})
export class BillsModule {}
