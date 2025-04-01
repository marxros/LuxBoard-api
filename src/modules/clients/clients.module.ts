import { Module } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { ClientsController } from './interface/controllers/clients.controller';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { ClientPrismaRepository } from './infra/prisma/client.prisma.repository';

@Module({
  controllers: [ClientsController],
  providers: [
    PrismaService,
    CreateClientUseCase,
    {
      provide: 'ClientRepository',
      useClass: ClientPrismaRepository,
    },
  ],
  exports: ['ClientRepository'],
})
export class ClientsModule {}
