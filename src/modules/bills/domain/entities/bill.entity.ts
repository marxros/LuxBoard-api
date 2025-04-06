export class Bill {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly referenceMonth: Date,
    public readonly energiaEletricaKwh: number,
    public readonly energiaEletricaValor: number,
    public readonly energiaSceeKwh: number,
    public readonly energiaSceeValor: number,
    public readonly energiaCompensadaKwh: number,
    public readonly energiaCompensadaValor: number,
    public readonly contribIlumPublicaValor: number,
    public readonly consumoTotal: number,
    public readonly valorTotalSemGD: number,
    public readonly economiaGD: number,
    public readonly filePath?: string,
  ) {}
}
