import { Injectable } from '@nestjs/common';
import { GetDashboardDataDto } from '../dto/get-dashboard-data.dto';
import { PrismaService } from '@/shared/prisma.service';
import { subMonths } from 'date-fns';

@Injectable()
export class GetDashboardDataUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetDashboardDataDto) {
    const { clientNumber, start, end } = query;

    let client = null;

    if (clientNumber) {
      client = await this.prisma.client.findFirst({
        where: { number: clientNumber },
      });

      if (!client) {
        return { summary: null, monthly: [] };
      }
    }

    const where: any = {};

    if (client) {
      where.clientId = client.id;
    }

    if (start || end) {
      const startDate = start ? new Date(start) : subMonths(new Date(), 6);
      const endDate = end ? new Date(end) : new Date();

      where.referenceMonth = {
        gte: startDate,
        lte: endDate,
      };
    }

    const bills = await this.prisma.bill.findMany({
      where,
      orderBy: { referenceMonth: 'asc' },
    });

    const monthly = bills.map((bill) => ({
      month: `${bill.referenceMonth.getMonth() + 1}/${bill.referenceMonth.getFullYear()}`,
      energiaConsumidaKwh: bill.energiaEletricaKwh + bill.energiaSceeKwh,
      energiaCompensadaKwh: bill.energiaCompensadaKwh,
      valorTotalSemGD: bill.valorTotalSemGD,
      economiaGD: bill.economiaGD,
    }));

    const summary = {
      totalEnergiaConsumidaKwh: bills.reduce(
        (acc, b) => acc + b.energiaEletricaKwh + b.energiaSceeKwh,
        0,
      ),
      totalEnergiaCompensadaKwh: bills.reduce(
        (acc, b) => acc + b.energiaCompensadaKwh,
        0,
      ),
      totalValorSemGD: bills.reduce((acc, b) => acc + b.valorTotalSemGD, 0),
      totalEconomiaGD: bills.reduce((acc, b) => acc + b.economiaGD, 0),
    };

    return { summary, monthly };
  }
}
