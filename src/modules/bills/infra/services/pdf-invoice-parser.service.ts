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

    const getNumber = (regex: RegExp): number => {
      const match = text.match(regex)?.[1] ?? '0';
      return parseFloat(match.replace(/\./g, '').replace(',', '.'));
    };

    const clientNumber =
      text.match(/Nº DA INSTALAÇÃO\s*\n\s*(\d+)/i)?.[1] ?? '';
    const referenceMonth =
      text.match(/([A-Z]{3}\/\d{4})\s+\d{2}\/\d{2}\/\d{4}/i)?.[1] ?? '';
    const clientName =
      text.match(/DÉBITO AUTOMÁTICO\s+([A-Z\s]+)\n/)?.[1]?.trim() ||
      text
        .match(/([A-Z][A-Z\s]+)(?= \d{8}\n(?:RUA|AV|AL|TRAV|ESTR))/)?.[1]
        ?.trim() ||
      '';

    const getLineTotalValue = (label: string): number => {
      const line = text.match(new RegExp(`${label}.*`, 'i'))?.[0] ?? '';

      // Match valores como -945,42 ou 1.172,83 com ou sem sinal
      const values = line.match(/-?\d{1,3}(?:\.\d{3})*,\d{2}/g);

      // Pegamos o primeiro valor com vírgula e mais de 4 caracteres (pra evitar pegar tarifa unitária tipo 0,48)
      const totalValue = values?.find((v) => v.length > 5) ?? '0';

      return parseFloat(totalValue.replace(/\./g, '').replace(',', '.'));
    };

    return {
      clientNumber,
      clientName,
      referenceMonth,
      energiaEletricaKwh: getNumber(/Energia El[ée]trica.*?kWh\s+(\d+)/i),
      energiaEletricaValor: getLineTotalValue('Energia El[ée]trica'),
      energiaSceeKwh: getNumber(/Energia SCEE.*?kWh\s+([\d.,]+)/i),
      energiaSceeValor: getLineTotalValue('Energia SCEE'),
      energiaCompensadaKwh: getNumber(/Energia compensada.*?kWh\s+([\d.,]+)/i),
      energiaCompensadaValor: getLineTotalValue('Energia compensada'),
      contribIlumPublicaValor: getNumber(/Contrib Ilum Publica.*?(\d+,\d{2})/i),
    };
  }
}
