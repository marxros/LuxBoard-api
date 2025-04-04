import { PdfInvoiceParserService } from './pdf-invoice-parser.service';
import * as pdfParse from 'pdf-parse';

jest.mock('pdf-parse');

describe('PdfInvoiceParserService', () => {
  let service: PdfInvoiceParserService;

  beforeEach(() => {
    service = new PdfInvoiceParserService();
  });

  it('should parse the PDF buffer and extract invoice data correctly', async () => {
    const mockPdfText = `
      Nº DA INSTALAÇÃO
      123456
      Referente a                                Vencimento                       Valor a pagar (R$)
      JAN/2023               01/01/2023               411,25

      Energia ElétricakWh      100  0,12345678        200,50 0,74906000
      Energia SCEE s/ ICMSkWh     50  0,65432109       100,25 0,48733000
      Energia compensada GD IkWh     30  0,45678900       -60,75 0,48733000
      Contrib Ilum Publica Municipal         10,00
    `;

    (pdfParse as jest.Mock).mockResolvedValue({ text: mockPdfText });

    const buffer = Buffer.from('mock-pdf-content');
    const result = await service.parse(buffer);

    expect(result).toEqual({
      clientNumber: '123456',
      referenceMonth: 'JAN/2023',
      energiaEletricaKwh: 100,
      energiaEletricaValor: 200.5,
      energiaSceeKwh: 50,
      energiaSceeValor: 100.25,
      energiaCompensadaKwh: 30,
      energiaCompensadaValor: -60.75,
      contribIlumPublicaValor: 10.0,
    });
  });

  it('should handle missing fields gracefully', async () => {
    const mockPdfText = `
      Nº DA INSTALAÇÃO
      654321
      FEV/2023 02/02/2023
      Energia ElétricakWh
      Energia SCEE s/ ICMSkWh
      Energia compensada GD IkWh
    `;

    (pdfParse as jest.Mock).mockResolvedValue({ text: mockPdfText });

    const buffer = Buffer.from('mock-pdf-content');
    const result = await service.parse(buffer);

    expect(result).toEqual({
      clientNumber: '654321',
      referenceMonth: 'FEV/2023',
      energiaEletricaKwh: 0,
      energiaEletricaValor: 0,
      energiaSceeKwh: 0,
      energiaSceeValor: 0,
      energiaCompensadaKwh: 0,
      energiaCompensadaValor: 0,
      contribIlumPublicaValor: 0,
    });
  });

  it('should return default values when PDF text is empty', async () => {
    (pdfParse as jest.Mock).mockResolvedValue({ text: '' });

    const buffer = Buffer.from('mock-pdf-content');
    const result = await service.parse(buffer);

    expect(result).toEqual({
      clientNumber: '',
      referenceMonth: '',
      energiaEletricaKwh: 0,
      energiaEletricaValor: 0,
      energiaSceeKwh: 0,
      energiaSceeValor: 0,
      energiaCompensadaKwh: 0,
      energiaCompensadaValor: 0,
      contribIlumPublicaValor: 0,
    });
  });

  it('should handle invalid number formats gracefully', async () => {
    const mockPdfText = `
      Nº DA INSTALAÇÃO
      789012
      MAR/2023 03/03/2023
      Energia ElétricakWh abc  xyz
      Energia SCEE s/ ICMSkWh     50  xxxxxx       100,25
    `;

    (pdfParse as jest.Mock).mockResolvedValue({ text: mockPdfText });

    const buffer = Buffer.from('mock-pdf-content');
    const result = await service.parse(buffer);

    expect(result).toEqual({
      clientNumber: '789012',
      referenceMonth: 'MAR/2023',
      energiaEletricaKwh: 0,
      energiaEletricaValor: 0,
      energiaSceeKwh: 50,
      energiaSceeValor: 100.25,
      energiaCompensadaKwh: 0,
      energiaCompensadaValor: 0,
      contribIlumPublicaValor: 0,
    });
  });
});
