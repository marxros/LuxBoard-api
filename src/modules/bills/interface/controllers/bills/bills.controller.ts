import { Controller, Post, Body } from '@nestjs/common';
import { CreateBillUseCase } from '../../../application/use-cases/create-bill/create-bill.use-case';
import { CreateBillDto } from '@/modules/bills/application/dto/create-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private createBillUseCase: CreateBillUseCase) {}

  @Post()
  async create(@Body() data: CreateBillDto): Promise<{ message: string }> {
    await this.createBillUseCase.execute({
      ...data,
      referenceMonth: new Date(data.referenceMonth),
    });
    return { message: 'Fatura criada com sucesso.' };
  }
}
