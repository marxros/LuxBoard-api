import { Bill } from '../entities/bill.entity';

export abstract class BillRepository {
  abstract create(bill: Bill): Promise<void>;
  abstract findByClient(clientId: string): Promise<Bill[]>;
}
