import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillItemDto } from './dto/create-bill-item.dto';
import { UpdateBillItemDto } from './dto/update-bill-item.dto';

@Injectable()
export class BillItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBillItemDto) {
    return this.prisma.billItem.create({ data });
  }

  async findAll() {
    return this.prisma.billItem.findMany({ include: { product: true, bill: true } });
  }

  async findOne(id: string) {
    const billItem = await this.prisma.billItem.findUnique({ where: { id }, include: { product: true, bill: true } });
    if (!billItem) throw new NotFoundException('Bill item not found');
    return billItem;
  }

  async update(id: string, data: UpdateBillItemDto) {
    await this.findOne(id);
    return this.prisma.billItem.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.billItem.delete({ where: { id } });
  }
}
