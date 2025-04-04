import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillsModule } from './modules/bills/bills.module';
import { SharedModule } from './shared/shared.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [BillsModule, SharedModule, ClientsModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
