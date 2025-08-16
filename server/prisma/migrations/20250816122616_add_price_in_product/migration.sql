-- AlterTable
ALTER TABLE "public"."BillItem" ALTER COLUMN "price" SET DEFAULT 0.00,
ALTER COLUMN "total" SET DEFAULT 0.00;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ALTER COLUMN "subItemContainer" SET DEFAULT false;
