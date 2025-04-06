export interface ParsedInvoiceData {
  clientNumber: string;
  clientName: string;
  referenceMonth: string;
  energiaEletricaKwh: number;
  energiaEletricaValor: number;
  energiaSceeKwh: number;
  energiaSceeValor: number;
  energiaCompensadaKwh: number;
  energiaCompensadaValor: number;
  contribIlumPublicaValor: number;
}
