import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  
  // Configure CORS
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Seed Store API')
    .setDescription('Billing & POS API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
