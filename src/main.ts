import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowedOrigins = [
        'http://localhost:3001',
        'http://localhost:4200',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:4200',
      ];
      const frontendUrl = process.env.FRONTEND_URL;
      if (frontendUrl) {
        const customOrigins = frontendUrl.split(',').map(o => o.trim());
        allowedOrigins.push(...customOrigins);
      }
      const isAllowed = allowedOrigins.includes(origin) ||
                        origin.endsWith('.onrender.com') ||
                        origin.endsWith('.vercel.app');
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Itaprime')
    .setVersion('1.0')
    .setDescription('Documentação da API de gerenciamento da loja ITAPRIME')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000).then(() => {
    console.log(
      `API rodando na URL: ${process.env.API_URL}:${process.env.API_PORT}`,
    );
    console.log(
      `Swagger rodando na URL:  ${process.env.API_URL}:${process.env.API_PORT}/api`,
    );
  });
}
bootstrap();
