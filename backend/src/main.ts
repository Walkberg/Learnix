import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ArrayWrapInterceptor } from './common/interceptors/array-wrap.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ArrayWrapInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
