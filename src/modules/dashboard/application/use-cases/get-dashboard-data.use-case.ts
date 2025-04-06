import { Injectable } from '@nestjs/common';
import { GetDashboardDataDto } from '../dto/get-dashboard-data.dto';
import { PrismaService } from '@/shared/prisma.service';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

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
      const startDate = start
        ? startOfMonth(new Date(start))
        : subMonths(new Date(), 6);
      const endDate = end ? endOfMonth(new Date(end)) : new Date();

      where.referenceMonth = {
        gte: startDate,
        lte: endDate,
      };

      console.log({
        clientId: client?.id,
        startDate,
        endDate,
      });
    }

    const bills = await this.prisma.bill.findMany({
      where,
      orderBy: { referenceMonth: 'asc' },
    });

    const grouped: Record<
      string,
      {
        energiaConsumidaKwh: number;
        energiaCompensadaKwh: number;
        valorTotalSemGD: number;
        economiaGD: number;
      }
    > = {};

    for (const bill of bills) {
      const key = `${bill.referenceMonth.getMonth() + 1}/${bill.referenceMonth.getFullYear()}`;

      if (!grouped[key]) {
        grouped[key] = {
          energiaConsumidaKwh: 0,
          energiaCompensadaKwh: 0,
          valorTotalSemGD: 0,
          economiaGD: 0,
        };
      }

      grouped[key].energiaConsumidaKwh +=
        bill.energiaEletricaKwh + bill.energiaSceeKwh;
      grouped[key].energiaCompensadaKwh += bill.energiaCompensadaKwh;
      grouped[key].valorTotalSemGD += bill.valorTotalSemGD;
      grouped[key].economiaGD += bill.economiaGD;
    }

    const monthly = Object.entries(grouped).map(([month, values]) => ({
      month,
      ...values,
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
