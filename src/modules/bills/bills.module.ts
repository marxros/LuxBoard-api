import { Module } from '@nestjs/common';
import { BillsController } from './interface/controllers/bills/bills.controller';
import { PrismaService } from '@/shared/prisma.service';
import { CreateBillUseCase } from './application/use-cases/create-bill/create-bill.use-case';
import { BillPrismaRepository } from './infra/prisma/bill.prisma.repository';

@Module({
  controllers: [BillsController],
  providers: [
    PrismaService,
    CreateBillUseCase,
    {
      provide: 'BillRepository',
      useClass: BillPrismaRepository,
    },
  ],
})
export class BillsModule {}
