import { Injectable } from '@nestjs/common';
import { Bill } from '../../../domain/entities/bill.entity';
import { BillRepository } from '../../../domain/repositories/bill.repository';

@Injectable()
export class CreateBillUseCase {
  constructor(private billRepository: BillRepository) {}

  async execute(data: Bill): Promise<void> {
    return this.billRepository.create(data);
  }
}
