import { Injectable } from '@nestjs/common';
import { InvoiceStorage } from '@/modules/bills/domain/services/invoice-storage.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalInvoiceStorageService implements InvoiceStorage {
  async save(
    buffer: Buffer,
    clientNumber: string,
    referenceMonth: string,
  ): Promise<string> {
    const filename = `${clientNumber}-${referenceMonth}.pdf`;
    const uploadDir = path.resolve('uploads/invoices');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer, { flag: 'w' });

    return filename;
  }
}
