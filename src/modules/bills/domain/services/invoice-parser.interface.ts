import { ParsedInvoiceData } from '../../application/dto/parsed-invoice-data.dto';

export abstract class InvoiceParser {
  abstract parse(buffer: Buffer): Promise<ParsedInvoiceData>;
}
