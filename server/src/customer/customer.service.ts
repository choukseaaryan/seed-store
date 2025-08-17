import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../common/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCustomerDto) {
    return this.prisma.customer.create({ data });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: Prisma.CustomerWhereInput = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { contactNumber: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    // Build orderBy clause
    const orderBy: Prisma.CustomerOrderByWithRelationInput = sortBy ? 
      { [sortBy]: sortOrder } : 
      { name: 'asc' };

    // Get total count
    const total = await this.prisma.customer.count({ where });

    // Get paginated data
    const data = await this.prisma.customer.findMany({
      where,
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
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, data: UpdateCustomerDto) {
    await this.findOne(id); // Throws if not found
    return this.prisma.customer.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id); // Throws if not found
    return this.prisma.customer.delete({ where: { id } });
  }

  async getBills(customerId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.BillWhereInput = {
      customerId,
    };

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

  async getTopCustomers() {
    // Get top customers by total bill amount
    return this.prisma.customer.findMany({
      include: {
        bills: {
          select: {
            totalAmount: true,
          },
        },
      },
      orderBy: {
        bills: {
          _count: 'desc',
        },
      },
      take: 10,
    });
  }
}
