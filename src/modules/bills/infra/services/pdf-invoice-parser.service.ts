import { Injectable } from '@nestjs/common';
import { InvoiceParser } from '../../domain/services/invoice-parser.interface';
import { ParsedInvoiceData } from '../../application/dto/parsed-invoice-data.dto';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class PdfInvoiceParserService implements InvoiceParser {
  async parse(buffer: Buffer): Promise<ParsedInvoiceData> {
    const data = await pdfParse(buffer);
    console.log('data2', data);
    const text = data.text;

    const getNumber = (regex: RegExp): number =>
      Number((text.match(regex)?.[1] ?? '0').replace(',', '.'));

    const clientNumber =
      text.match(/Nº DA INSTALAÇÃO\s*\n\s*(\d+)/i)?.[1] ?? '';
    const referenceMonth =
      text.match(/([A-Z]{3}\/\d{4})\s+\d{2}\/\d{2}\/\d{4}/i)?.[1] ?? '';

    const getLineTotalValue = (label: string): number => {
      const line = text.match(new RegExp(`${label}.*`, 'i'))?.[0] ?? '';
      const values = line.match(/-?\d+,\d{2}/g);
      return values && values.length >= 2
        ? Number(values[values.length - 2].replace(',', '.'))
        : 0;
    };

    return {
      clientNumber,
      referenceMonth,
      energiaEletricaKwh: getNumber(/Energia El[ée]trica.*?kWh\s+(\d+)/i),
      energiaEletricaValor: getLineTotalValue('Energia El[ée]trica'),
      energiaSceeKwh: getNumber(/Energia SCEE.*?kWh\s+(\d+)/i),
      energiaSceeValor: getLineTotalValue('Energia SCEE'),
      energiaCompensadaKwh: getNumber(/Energia compensada.*?kWh\s+(\d+)/i),
      energiaCompensadaValor: getLineTotalValue('Energia compensada'),
      contribIlumPublicaValor: getNumber(/Contrib Ilum Publica.*?(\d+,\d{2})/i),
    };
  }
}
