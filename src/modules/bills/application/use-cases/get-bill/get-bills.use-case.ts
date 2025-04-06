import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { parse, startOfMonth, endOfMonth } from 'date-fns';
import { GetBillsDto } from '../../dto/get-bills.dto';

@Injectable()
export class GetBillsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetBillsDto) {
    const { clientNumber, month } = query;

    let clientId: string | undefined = undefined;

    if (clientNumber) {
      const client = await this.prisma.client.findFirst({
        where: { number: clientNumber },
      });
      if (!client) return [];
      clientId = client.id;
    }

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (month) {
      const [m, y] = month.split('/');
      const parsed = parse(`01/${m}/${y}`, 'dd/MM/yyyy', new Date());
      startDate = startOfMonth(parsed);
      endDate = endOfMonth(parsed);
    }

    const bills = await this.prisma.bill.findMany({
      where: {
        ...(clientId && { clientId }),
        ...(startDate &&
          endDate && {
            referenceMonth: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      orderBy: { referenceMonth: 'desc' },
      include: {
        client: true,
      },
    });

    return bills.map((bill) => ({
      id: bill.id,
      clientNumber: bill.client.number,
      clientName: bill.client.name,
      totalValue:
        bill.energiaEletricaValor +
        bill.energiaSceeValor +
        bill.energiaCompensadaValor +
        bill.contribIlumPublicaValor,
      referenceMonth:
        `${bill.referenceMonth.getMonth() + 1}`.padStart(2, '0') +
        `/${bill.referenceMonth.getFullYear()}`,
      downloadUrl: `http://localhost:3000/bills/${bill.id}/download`,
    }));
  }
}
