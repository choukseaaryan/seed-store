import { openDB } from 'idb';
import type { DBSchema } from 'idb';

interface SeedStoreDB extends DBSchema {
  products: {
    key: string;
    value: {
      id: string;
      name: string;
      price: number;
      stock: number;
      category: string;
      updatedAt: string;
    };
    indexes: {
      'by-category': string;
      'by-name': string;
    };
  };
  sales: {
    key: string;
    value: {
      id: string;
      items: Array<{
        productId: string;
        quantity: number;
        price: number;
      }>;
      total: number;
      date: string;
      status: 'completed' | 'pending' | 'syncing' | 'failed';
    };
    indexes: {
      'by-date': string;
      'by-status': string;
    };
  };
}

const DB_NAME = 'seed-store-db';
const DB_VERSION = 1;

export async function initDB() {
  const db = await openDB<SeedStoreDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Products store
      const productStore = db.createObjectStore('products', { keyPath: 'id' });
      productStore.createIndex('by-category', 'category');
      productStore.createIndex('by-name', 'name');

      // Sales store
      const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
      salesStore.createIndex('by-date', 'date');
      salesStore.createIndex('by-status', 'status');
    },
  });

  return db;
}

export async function getAllProducts() {
  const db = await openDB<SeedStoreDB>(DB_NAME, DB_VERSION);
  return db.getAll('products');
}

export async function getProduct(id: string) {
  const db = await openDB<SeedStoreDB>(DB_NAME, DB_VERSION);
  return db.get('products', id);
}

export async function saveProduct(product: SeedStoreDB['products']['value']) {
  const db = await openDB<SeedStoreDB>(DB_NAME, DB_VERSION);
  await db.put('products', product);
}

export async function saveSale(sale: SeedStoreDB['sales']['value']) {
  const db = await openDB<SeedStoreDB>(DB_NAME, DB_VERSION);
  await db.put('sales', sale);
}

export async function getPendingSales() {
  const db = await openDB<SeedStoreDB>(DB_NAME, DB_VERSION);
  return db.getAllFromIndex('sales', 'by-status', 'pending');
}

export async function updateSaleStatus(id: string, status: SeedStoreDB['sales']['value']['status']) {
  const db = await openDB<SeedStoreDB>(DB_NAME, DB_VERSION);
  const sale = await db.get('sales', id);
  if (sale) {
    sale.status = status;
    await db.put('sales', sale);
  }
}
