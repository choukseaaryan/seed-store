import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './productCategory/product-category.module';
import { SupplierModule } from './supplier/supplier.module';
import { BillModule } from './bill/bill.module';
import { BillItemModule } from './billItem/bill-item.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { LoggingMiddleware } from './common/logger/logging.middleware';

@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    CustomerModule,
    ProductModule,
    ProductCategoryModule,
    SupplierModule,
    BillModule,
    BillItemModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
