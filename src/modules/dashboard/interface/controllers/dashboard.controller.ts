import { Controller, Get, Query } from '@nestjs/common';
import { GetDashboardDataUseCase } from '../../application/use-cases/get-dashboard-data.use-case';
import { GetDashboardDataDto } from '../../application/dto/get-dashboard-data.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardDataUseCase: GetDashboardDataUseCase,
  ) {}

  @Get()
  async getDashboardData(@Query() query: GetDashboardDataDto) {
    return this.getDashboardDataUseCase.execute(query);
  }
}
