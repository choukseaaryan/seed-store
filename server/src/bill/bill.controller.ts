import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto';

@ApiTags('Bills')
@Controller('bills')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bill' })
  create(@Body() createBillDto: CreateBillDto) {
    return this.billService.create(createBillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bills' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.billService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bill by id' })
  findOne(@Param('id') id: string) {
    return this.billService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bill by id' })
  update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return this.billService.update(id, updateBillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bill by id' })
  remove(@Param('id') id: string) {
    return this.billService.remove(id);
  }
}
