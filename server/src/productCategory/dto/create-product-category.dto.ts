import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @ApiProperty({ description: 'Product category name' })
  @IsString()
  name: string;
}
