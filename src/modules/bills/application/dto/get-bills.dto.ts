import { IsOptional, IsString } from 'class-validator';

export class GetBillsDto {
  @IsOptional()
  @IsString()
  clientNumber?: string;

  @IsOptional()
  @IsString()
  month?: string;
}
