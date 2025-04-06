import { GetBillsUseCase } from './../../../application/use-cases/get-bill/get-bills.use-case';
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CreateBillUseCase } from '../../../application/use-cases/create-bill/create-bill.use-case';
import { CreateBillDto } from '@/modules/bills/application/dto/create-bill.dto';
import { GetBillsDto } from '@/modules/bills/application/dto/get-bills.dto';

@Controller('bills')
export class BillsController {
  constructor(
    private createBillUseCase: CreateBillUseCase,
    private getBillsUseCase: GetBillsUseCase,
  ) {}

  @Post()
  async create(@Body() data: CreateBillDto): Promise<{ message: string }> {
    await this.createBillUseCase.execute({
      ...data,
      referenceMonth: new Date(data.referenceMonth),
    });
    return { message: 'Fatura criada com sucesso.' };
  }

  @Get()
  async getBills(@Query() query: GetBillsDto) {
    return this.getBillsUseCase.execute(query);
  }
}
