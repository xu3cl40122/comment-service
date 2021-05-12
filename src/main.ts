import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/httpException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    "allowedHeaders": ['Content-Type', 'Authorization'],
    "exposedHeaders": ['Content-Type', 'Authorization'],
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  })
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
