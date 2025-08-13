import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreateBillItemDto {
  @IsString()
  billId: string;

  @IsString()
  productId: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  total: number;
}
