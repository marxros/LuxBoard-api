import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { BillRepository } from '../../domain/repositories/bill.repository';
import { Bill } from '../../domain/entities/bill.entity';

@Injectable()
export class BillPrismaRepository implements BillRepository {
  constructor(private prisma: PrismaService) {}

  async create(bill: Bill): Promise<void> {
    console.log('bill', bill);
    await this.prisma.bill.create({
      data: { ...bill },
    });
  }

  async findByClient(clientId: string): Promise<Bill[]> {
    const bills = await this.prisma.bill.findMany({ where: { clientId } });
    return bills;
  }

  async findByClientAndMonth(clientId: string, referenceMonth: Date) {
    return this.prisma.bill.findFirst({
      where: {
        clientId,
        referenceMonth: {
          gte: new Date(
            referenceMonth.getFullYear(),
            referenceMonth.getMonth(),
            1,
          ),
          lt: new Date(
            referenceMonth.getFullYear(),
            referenceMonth.getMonth() + 1,
            1,
          ),
        },
      },
    });
  }

  async update(bill: Bill): Promise<void> {
    await this.prisma.bill.update({
      where: { id: bill.id },
      data: {
        energiaEletricaKwh: bill.energiaEletricaKwh,
        energiaEletricaValor: bill.energiaEletricaValor,
        energiaSceeKwh: bill.energiaSceeKwh,
        energiaSceeValor: bill.energiaSceeValor,
        energiaCompensadaKwh: bill.energiaCompensadaKwh,
        energiaCompensadaValor: bill.energiaCompensadaValor,
        contribIlumPublicaValor: bill.contribIlumPublicaValor,
        consumoTotal: bill.consumoTotal,
        valorTotalSemGD: bill.valorTotalSemGD,
        economiaGD: bill.economiaGD,
      },
    });
  }
}
