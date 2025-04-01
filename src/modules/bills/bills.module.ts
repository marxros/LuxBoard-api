import { Module } from '@nestjs/common';
import { BillsController } from './interface/controllers/bills/bills.controller';
import { CreateBillService } from './application/use-cases/create-bill/create-bill.service';

@Module({
  controllers: [BillsController],
  providers: [CreateBillService]
})
export class BillsModule {}
