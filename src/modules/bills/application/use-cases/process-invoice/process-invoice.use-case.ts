import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InvoiceParser } from '../../../domain/services/invoice-parser.interface';
import { ClientRepository } from '@/modules/clients/domain/repositories/client.repository';
import { BillRepository } from '../../../domain/repositories/bill.repository';
import { Client } from '@/modules/clients/domain/entities/client.entity';
import { Bill } from '../../../domain/entities/bill.entity';
import { randomUUID } from 'crypto';
import { InvoiceStorage } from '@/modules/bills/domain/services/invoice-storage.interface';

@Injectable()
export class ProcessInvoiceUseCase {
  constructor(
    @Inject('InvoiceParser') private readonly parser: InvoiceParser,
    @Inject('ClientRepository') private readonly clientRepo: ClientRepository,
    @Inject('BillRepository') private readonly billRepo: BillRepository,
    @Inject('InvoiceStorage') private readonly storage: InvoiceStorage,
  ) {}

  async execute(buffer: Buffer): Promise<{ client: Client; bill: Bill }> {
    const data = await this.parser.parse(buffer);

    if (!data.clientNumber?.trim()) {
      throw new BadRequestException('Número do cliente não encontrado no PDF.');
    }

    if (!data.referenceMonth?.trim()) {
      throw new BadRequestException('Mês de referência não encontrado no PDF.');
    }

    let client = await this.clientRepo.findByNumber(data.clientNumber);
    if (!client) {
      client = new Client(randomUUID(), data.clientNumber, data.clientName);
      const result = await this.clientRepo.create(client);
      console.log('result', result);
    }

    const referenceDate = this.parseMonth(data.referenceMonth);

    const filePath = await this.storage.save(
      buffer,
      data.clientNumber,
      referenceDate.toISOString(),
    );

    const existingBill = await this.billRepo.findByClientAndMonth(
      client.id,
      referenceDate,
    );

    const consumoTotal = data.energiaEletricaKwh + data.energiaSceeKwh;
    const valorTotalSemGD =
      data.energiaEletricaValor +
      data.energiaSceeValor +
      data.contribIlumPublicaValor;
    const economiaGD = data.energiaCompensadaValor;

    if (existingBill) {
      const updatedBill = new Bill(
        existingBill.id,
        existingBill.clientId,
        existingBill.referenceMonth,
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
        filePath,
      );

      await this.billRepo.update(updatedBill);
      return { client, bill: updatedBill };
    }

    const bill = new Bill(
      randomUUID(),
      client.id,
      referenceDate,
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
      filePath,
    );

    await this.billRepo.create(bill);

    return { client, bill };
  }

  private parseMonth(raw: string): Date {
    const months: Record<string, number> = {
      JAN: 0,
      FEV: 1,
      MAR: 2,
      ABR: 3,
      MAI: 4,
      JUN: 5,
      JUL: 6,
      AGO: 7,
      SET: 8,
      OUT: 9,
      NOV: 10,
      DEZ: 11,
    };

    const [mes, ano] = raw.toUpperCase().split('/');
    const month = months[mes];

    if (month === undefined || isNaN(Number(ano))) {
      throw new Error(`Data inválida extraída: ${raw}`);
    }

    return new Date(Number(ano), month);
  }
}
