import { Bill } from '../entities/bill.entity';

export abstract class BillRepository {
  abstract create(bill: Bill): Promise<void>;
  abstract findByClient(clientId: string): Promise<Bill[]>;
  abstract findByClientAndMonth(
    clientId: string,
    referenceMonth: Date,
  ): Promise<Bill | null>;
  abstract update(bill: Bill): Promise<void>;
}
