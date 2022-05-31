import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import 'dotenv/config';
import * as dotenv from 'dotenv';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors({
    origin: [
      'http://smaf.site',
      'http://localhost:3000',
      'https://backend.smaf.shop',
      'http://localhost:5500',
    ],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
