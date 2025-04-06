import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { Client } from '../../domain/entities/client.entity';
import { ClientRepository } from '../../domain/repositories/client.repository';

@Injectable()
export class ClientPrismaRepository implements ClientRepository {
  constructor(private prisma: PrismaService) {}

  async create(client: Client): Promise<Client> {
    try {
      const result = await this.prisma.client.create({ data: client });
      return result;
    } catch (error) {
      console.log('error', error);
    }
  }

  async findByNumber(number: string): Promise<Client | null> {
    const result = await this.prisma.client.findFirst({
      where: { number },
    });

    return result
      ? new Client(result.id, result.number, result.name, result.createdAt)
      : null;
  }
}
