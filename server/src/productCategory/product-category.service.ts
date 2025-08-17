import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../common/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductCategoryDto) {
    // Check if category already exists
    const existingCategory = await this.prisma.productCategory.findFirst({ where: { name: data.name } });
    if (existingCategory) throw new Error('Product category already exists');

    return this.prisma.productCategory.create({ data });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, search, sortBy, sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: Prisma.ProductCategoryWhereInput = search ? {
      name: { contains: search, mode: 'insensitive' }
    } : {};

    // Build orderBy clause
    const orderBy: Prisma.ProductCategoryOrderByWithRelationInput = sortBy ? 
      { [sortBy]: sortOrder } : 
      { name: 'asc' };

    // Get total count
    const total = await this.prisma.productCategory.count({ where });

    // Get paginated data
    const data = await this.prisma.productCategory.findMany({
      where,
      include: { products: true },
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
    const category = await this.prisma.productCategory.findUnique({ where: { id }, include: { products: true } });
    if (!category) throw new NotFoundException('Product category not found');
    return category;
  }

  async update(id: string, data: UpdateProductCategoryDto) {
    await this.findOne(id);
    return this.prisma.productCategory.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productCategory.delete({ where: { id } });
  }
}
