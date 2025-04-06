import { GetBillsUseCase } from './../../../application/use-cases/get-bill/get-bills.use-case';
import { Controller, Post, Body, Get, Query, Param, Res } from '@nestjs/common';
import { CreateBillUseCase } from '../../../application/use-cases/create-bill/create-bill.use-case';
import { CreateBillDto } from '@/modules/bills/application/dto/create-bill.dto';
import { GetBillsDto } from '@/modules/bills/application/dto/get-bills.dto';
import { Response } from 'express';

import { DownloadInvoiceUseCase } from '@/modules/bills/application/use-cases/download-invoice/download-invoice.use-case';

@Controller('bills')
export class BillsController {
  constructor(
    private createBillUseCase: CreateBillUseCase,
    private getBillsUseCase: GetBillsUseCase,
    private downloadInvoiceUseCase: DownloadInvoiceUseCase,
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

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const filePath = await this.downloadInvoiceUseCase.execute(id);
    return res.download(filePath);
  }
}
