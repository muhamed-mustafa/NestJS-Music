import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour)
      message:
        'Too many accounts created from this IP, please try again after an hour',
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'files'));
  await app.listen(process.env.PORT);
}

bootstrap();
