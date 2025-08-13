-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CARD', 'UPI');

-- CreateEnum
CREATE TYPE "public"."SaleStatus" AS ENUM ('PAID', 'VOID', 'REFUND');

-- CreateEnum
CREATE TYPE "public"."SyncStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "pinCode" TEXT,
    "contactNumber" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "technicalName" TEXT,
    "stockQty" INTEGER NOT NULL,
    "subItemContainer" BOOLEAN NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bill" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "saleStatus" "public"."SaleStatus" NOT NULL,
    "syncStatus" "public"."SyncStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillItem" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "BillItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "pinCode" TEXT,
    "contactPerson" TEXT,
    "contactNumber" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_itemCode_key" ON "public"."Product"("itemCode");

-- CreateIndex
CREATE UNIQUE INDEX "Bill_invoiceNo_key" ON "public"."Bill"("invoiceNo");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bill" ADD CONSTRAINT "Bill_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillItem" ADD CONSTRAINT "BillItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillItem" ADD CONSTRAINT "BillItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
