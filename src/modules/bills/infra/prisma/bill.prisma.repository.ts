import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { BillRepository } from '../../domain/repositories/bill.repository';
import { Bill } from '../../domain/entities/bill.entity';

@Injectable()
export class BillPrismaRepository implements BillRepository {
  constructor(private prisma: PrismaService) {}

  async create(bill: Bill): Promise<void> {
    await this.prisma.bill.create({
      data: { ...bill },
    });
  }

  async findByClient(clientId: string): Promise<Bill[]> {
    const bills = await this.prisma.bill.findMany({ where: { clientId } });
    return bills;
  }
}
