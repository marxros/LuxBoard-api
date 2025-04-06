import { Client } from '../entities/client.entity';

export abstract class ClientRepository {
  abstract create(client: Client): Promise<Client>;
  abstract findByNumber(number: string): Promise<Client | null>;
}
