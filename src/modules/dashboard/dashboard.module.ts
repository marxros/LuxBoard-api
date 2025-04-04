import { Module } from '@nestjs/common';
import { GetDashboardDataUseCase } from './application/use-cases/get-dashboard-data.use-case';
import { SharedModule } from '@/shared/shared.module';
import { DashboardController } from './interface/controllers/dashboard.controller';

@Module({
  imports: [SharedModule],
  controllers: [DashboardController],
  providers: [GetDashboardDataUseCase],
})
export class DashboardModule {}
