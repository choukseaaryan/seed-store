import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductCategoryDto) {
    return this.prisma.productCategory.create({ data });
  }

  async findAll() {
    return this.prisma.productCategory.findMany({ include: { products: true } });
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
