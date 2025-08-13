export interface Customer {
  id: string;
  name: string;
  address?: string;
  pinCode?: string;
  contactNumber: string;
}

export interface Product {
  id: string;
  categoryId: string;
  category: ProductCategory;
  companyName: string;
  itemCode: string;
  itemName: string;
  technicalName?: string;
  stockQty: number;
  subItemContainer: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Bill {
  id: string;
  invoiceNo: string;
  date: string;
  customerId?: string;
  customer?: Customer;
  paymentMethod: 'CASH' | 'CARD' | 'UPI';
  saleStatus: 'PAID' | 'VOID' | 'REFUND';
  syncStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  totalAmount: number;
  billItems: BillItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Supplier {
  id: string;
  name: string;
  address?: string;
  pinCode?: string;
  contactPerson?: string;
  contactNumber: string;
}
