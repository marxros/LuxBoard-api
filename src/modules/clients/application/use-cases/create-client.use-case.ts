import { Inject, Injectable } from '@nestjs/common';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { Client } from '../../domain/entities/client.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject('ClientRepository')
    private readonly clientRepo: ClientRepository,
  ) {}

  async execute(number: string, name: string): Promise<Client> {
    const client = new Client(randomUUID(), number, name);
    await this.clientRepo.create(client);
    return client;
  }
}
