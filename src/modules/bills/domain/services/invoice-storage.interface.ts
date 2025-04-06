export interface InvoiceStorage {
  save(
    buffer: Buffer,
    clientNumber: string,
    referenceMonth: string,
  ): Promise<string>;
}
