import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Product Categories
  const seedsCategory = await prisma.productCategory.create({
    data: { name: 'Seeds' }
  });
  const fertilizerCategory = await prisma.productCategory.create({
    data: { name: 'Fertilizers' }
  });

  // Products
  const wheat = await prisma.product.create({
    data: {
      categoryId: seedsCategory.id,
      companyName: 'AgroCorp',
      itemCode: 'WHT001',
      itemName: 'Wheat Seeds',
      technicalName: 'Triticum aestivum',
      stockQty: 1000,
      subItemContainer: false
    }
  });
  const urea = await prisma.product.create({
    data: {
      categoryId: fertilizerCategory.id,
      companyName: 'FertiBest',
      itemCode: 'FRT001',
      itemName: 'Urea',
      technicalName: 'Carbamide',
      stockQty: 500,
      subItemContainer: false
    }
  });

  // Customers
  const customer = await prisma.customer.create({
    data: {
      name: 'John Doe',
      address: '123 Main St',
      pinCode: '123456',
      contactNumber: '9876543210'
    }
  });

  // Suppliers
  await prisma.supplier.create({
    data: {
      name: 'Supplier One',
      address: '456 Supplier Rd',
      pinCode: '654321',
      contactPerson: 'Jane Smith',
      contactNumber: '9123456780'
    }
  });

  // Bill
  const bill = await prisma.bill.create({
    data: {
      invoiceNo: 'INV-1001',
      date: new Date(),
      customerId: customer.id,
      paymentMethod: 'CASH',
      saleStatus: 'PAID',
      syncStatus: 'PENDING',
      totalAmount: 1200.00,
      billItems: {
        create: [
          {
            productId: wheat.id,
            quantity: 10,
            price: 100.00,
            total: 1000.00
          },
          {
            productId: urea.id,
            quantity: 2,
            price: 100.00,
            total: 200.00
          }
        ]
      }
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
