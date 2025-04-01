import { IsDateString, IsNumber, IsUUID } from 'class-validator';

export class CreateBillDto {
  @IsUUID()
  clientId: string;

  @IsDateString()
  referenceMonth: string;

  @IsNumber()
  energiaEletricaKwh: number;

  @IsNumber()
  energiaEletricaValor: number;

  @IsNumber()
  energiaSceeKwh: number;

  @IsNumber()
  energiaSceeValor: number;

  @IsNumber()
  energiaCompensadaKwh: number;

  @IsNumber()
  energiaCompensadaValor: number;

  @IsNumber()
  contribIlumPublicaValor: number;
}
