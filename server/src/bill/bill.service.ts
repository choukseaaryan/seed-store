import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBillDto) {
    return this.prisma.bill.create({
      data: {
        ...data,
        billItems: {
          create: data.billItems,
        },
      },
      include: { billItems: true },
    });
  }

  async findAll() {
    return this.prisma.bill.findMany({ include: { billItems: true, customer: true } });
  }

  async findOne(id: string) {
    const bill = await this.prisma.bill.findUnique({ where: { id }, include: { billItems: true, customer: true } });
    if (!bill) throw new NotFoundException('Bill not found');
    return bill;
  }

  async update(id: string, updateBillDto: UpdateBillDto) {
    await this.findOne(id);
    const { billItems, ...data } = updateBillDto;
    return this.prisma.bill.update({
      where: { id },
      data: {
        ...data,
        ...(billItems && {
          billItems: {
            deleteMany: {},
            create: billItems
          }
        })
      },
      include: { billItems: true }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.bill.delete({ where: { id } });
  }
}
