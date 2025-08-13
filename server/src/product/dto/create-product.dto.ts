import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'ID of the product category' })
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'Company/manufacturer name' })
  @IsString()
  companyName: string;

  @ApiProperty({ description: 'Unique item code' })
  @IsString()
  itemCode: string;

  @ApiProperty({ description: 'Display name of the product' })
  @IsString()
  itemName: string;

  @ApiProperty({ description: 'Technical/scientific name', required: false })
  @IsOptional()
  @IsString()
  technicalName?: string;

  @ApiProperty({ description: 'Current stock quantity' })
  @IsInt()
  stockQty: number;

  @ApiProperty({ description: 'Whether this item can contain sub-items' })
  @IsBoolean()
  subItemContainer: boolean;
}
