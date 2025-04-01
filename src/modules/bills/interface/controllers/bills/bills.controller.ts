import { Controller, Post, Body } from '@nestjs/common';
import { CreateBillUseCase } from '../../../application/use-cases/create-bill/create-bill.use-case.service';
import { Bill } from '../../../domain/entities/bill.entity';

@Controller('bills')
export class BillsController {
  constructor(private createBillUseCase: CreateBillUseCase) {}

  @Post()
  async create(@Body() body: any) {
    const bill = new Bill(
      body.id,
      body.clientId,
      new Date(body.referenceMonth),
      body.energiaEletricaKwh,
      body.energiaEletricaValor,
      body.energiaSceeKwh,
      body.energiaSceeValor,
      body.energiaCompensadaKwh,
      body.energiaCompensadaValor,
      body.contribIlumPublicaValor,
      body.consumoTotal,
      body.valorTotalSemGD,
      body.economiaGD,
    );
    await this.createBillUseCase.execute(bill);
  }
}
