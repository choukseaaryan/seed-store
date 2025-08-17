import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBillItemDto } from '../../billItem/dto/create-bill-item.dto';

export type PaymentMethod = 'CASH' | 'CREDIT';
export type SaleStatus = 'PAID' | 'VOID' | 'REFUND';
export type SyncStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export class CreateBillDto {
  @IsString()
  invoiceNo: string;

  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsString()
  paymentMethod: PaymentMethod;

  @IsString()
  saleStatus: SaleStatus;

  @IsOptional()
  @IsString()
  syncStatus?: SyncStatus;

  @IsNumber()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBillItemDto)
  billItems: CreateBillItemDto[];
}
