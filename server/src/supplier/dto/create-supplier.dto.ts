import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({ description: 'Supplier company/business name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Supplier address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Supplier PIN code', required: false })
  @IsOptional()
  @IsString()
  pinCode?: string;

  @ApiProperty({ description: 'Contact person name', required: false })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsString()
  contactNumber: string;
}
