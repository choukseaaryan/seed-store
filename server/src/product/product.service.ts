import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../common/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: Prisma.ProductWhereInput = search ? {
      OR: [
        { itemName: { contains: search, mode: 'insensitive' } },
        { itemCode: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { technicalName: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    // Build orderBy clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = sortBy ? 
      { [sortBy]: sortOrder } : 
      { itemName: 'asc' };

    // Get total count
    const total = await this.prisma.product.count({ where });

    // Get paginated data
    const data = await this.prisma.product.findMany({
      where,
      include: { category: true, billItems: true },
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
    const product = await this.prisma.product.findUnique({ where: { id }, include: { category: true, billItems: true } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async findByCategory(categoryId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      categoryId,
      ...(search ? {
        OR: [
          { itemName: { contains: search, mode: 'insensitive' } },
          { itemCode: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
        ]
      } : {})
    };

    // Build orderBy clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = sortBy ? 
      { [sortBy]: sortOrder } : 
      { itemName: 'asc' };

    // Get total count
    const total = await this.prisma.product.count({ where });

    // Get paginated data
    const data = await this.prisma.product.findMany({
      where,
      include: { category: true, billItems: true },
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

  async findLowStock(query: PaginationQueryDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause for low stock (less than 10 items)
    const where: Prisma.ProductWhereInput = {
      stockQty: { lt: 10 }
    };

    // Build orderBy clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = sortBy ? 
      { [sortBy]: sortOrder } : 
      { stockQty: 'asc' };

    // Get total count
    const total = await this.prisma.product.count({ where });

    // Get paginated data
    const data = await this.prisma.product.findMany({
      where,
      include: { category: true, billItems: true },
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

  async updateStock(id: string, quantity: number) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { stockQty: quantity }
    });
  }
}
