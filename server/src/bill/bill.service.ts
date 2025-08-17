import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../common/dto';
import { Prisma } from '@prisma/client';

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

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: Prisma.BillWhereInput = search ? {
      OR: [
        { invoiceNo: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ]
    } : {};

    // Build orderBy clause
    const orderBy: Prisma.BillOrderByWithRelationInput = sortBy ? 
      { [sortBy]: sortOrder } : 
      { date: 'desc' };

    // Get total count
    const total = await this.prisma.bill.count({ where });

    // Get paginated data
    const data = await this.prisma.bill.findMany({
      where,
      include: { billItems: true, customer: true },
      skip,
      take: limit,
      orderBy,
    });

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        currentPage: page,
        lastPage,
        perPage: limit,
      },
    };
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
