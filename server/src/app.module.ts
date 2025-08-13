import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
export class AppModule {}
