import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
  // Create and configure logger
  const logger = new LoggerService();
  app.useLogger(logger);
  logger.log('Starting Seed Store API...', 'Bootstrap');
  
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  
  // Configure CORS - Allow both development and production clients
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'file://', // For Electron production builds
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or starts with file://
      if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Only enable Swagger in development
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Seed Store API')
      .setDescription('Billing & POS API documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`, 'Bootstrap');
  logger.log(`Environment: ${process.env.NODE_ENV}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
