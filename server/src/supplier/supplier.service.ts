import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSupplierDto) {
    return this.prisma.supplier.create({ data });
  }

  async findAll() {
    return this.prisma.supplier.findMany();
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
