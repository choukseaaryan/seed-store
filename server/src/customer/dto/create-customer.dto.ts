import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Customer full name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Customer address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Customer PIN code', required: false })
  @IsOptional()
  @IsString()
  pinCode?: string;

  @ApiProperty({ description: 'Customer contact number' })
  @IsString()
  contactNumber: string;
}
