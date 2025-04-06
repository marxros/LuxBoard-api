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

  async findById(id: string): Promise<Bill | null> {
    const data = await this.prisma.bill.findUnique({ where: { id } });
    if (!data) return null;

    return new Bill(
      data.id,
      data.clientId,
      data.referenceMonth,
      data.energiaEletricaKwh,
      data.energiaEletricaValor,
      data.energiaSceeKwh,
      data.energiaSceeValor,
      data.energiaCompensadaKwh,
      data.energiaCompensadaValor,
      data.contribIlumPublicaValor,
      data.consumoTotal,
      data.valorTotalSemGD,
      data.economiaGD,
      data.filePath,
    );
  }

  async findMany(params?: {
    clientId?: string;
    start?: Date;
    end?: Date;
  }): Promise<Bill[]> {
    const where: any = {};

    if (params?.clientId) {
      where.clientId = params.clientId;
    }

    if (params?.start || params?.end) {
      where.referenceMonth = {
        gte: params.start ?? new Date('1900-01-01'),
        lte: params.end ?? new Date(),
      };
    }

    const result = await this.prisma.bill.findMany({
      where,
      orderBy: { referenceMonth: 'asc' },
    });

    return result.map(
      (b) =>
        new Bill(
          b.id,
          b.clientId,
          b.referenceMonth,
          b.energiaEletricaKwh,
          b.energiaEletricaValor,
          b.energiaSceeKwh,
          b.energiaSceeValor,
          b.energiaCompensadaKwh,
          b.energiaCompensadaValor,
          b.contribIlumPublicaValor,
          b.consumoTotal,
          b.valorTotalSemGD,
          b.economiaGD,
          b.filePath,
        ),
    );
  }
}
