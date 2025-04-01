import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillsModule } from './modules/bills/bills.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [BillsModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
