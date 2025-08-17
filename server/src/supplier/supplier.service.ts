import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../common/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSupplierDto) {
    return this.prisma.supplier.create({ data });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: Prisma.SupplierWhereInput = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { contactNumber: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    // Build orderBy clause
    const orderBy: Prisma.SupplierOrderByWithRelationInput = sortBy ? 
      { [sortBy]: sortOrder } : 
      { name: 'asc' };

    // Get total count
    const total = await this.prisma.supplier.count({ where });

    // Get paginated data
    const data = await this.prisma.supplier.findMany({
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
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async update(id: string, data: UpdateSupplierDto) {
    await this.findOne(id);
    return this.prisma.supplier.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.supplier.delete({ where: { id } });
  }
}
