import { Bill } from '@/modules/bills/domain/entities/bill.entity';
import { BillRepository } from '@/modules/bills/domain/repositories/bill.repository';
import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

@Injectable()
export class CreateBillUseCase {
  constructor(
    @Inject('BillRepository')
    private readonly billRepository: BillRepository,
  ) {}

  async execute(
    data: Omit<Bill, 'id' | 'consumoTotal' | 'valorTotalSemGD' | 'economiaGD'>,
  ): Promise<void> {
    const consumoTotal = data.energiaEletricaKwh + data.energiaSceeKwh;
    const valorTotalSemGD =
      data.energiaEletricaValor +
      data.energiaSceeValor +
      data.contribIlumPublicaValor;
    const economiaGD = data.energiaCompensadaValor;

    const bill = new Bill(
      randomUUID(),
      data.clientId,
      data.referenceMonth,
      data.energiaEletricaKwh,
      data.energiaEletricaValor,
      data.energiaSceeKwh,
      data.energiaSceeValor,
      data.energiaCompensadaKwh,
      data.energiaCompensadaValor,
      data.contribIlumPublicaValor,
      consumoTotal,
      valorTotalSemGD,
      economiaGD,
      data.filePath,
    );

    await this.billRepository.create(bill);
  }
}
