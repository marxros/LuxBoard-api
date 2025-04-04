import { IsOptional, IsString, IsDateString } from 'class-validator';

export class GetDashboardDataDto {
  @IsOptional()
  @IsString()
  clientNumber?: string;

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;
}
