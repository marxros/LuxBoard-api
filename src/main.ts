import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'luxboard-api.onrender.com',
  });

  await app.listen(3000);
}
bootstrap();
