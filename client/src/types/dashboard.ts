interface Sale {
  id: string;
  date: string;
  total: number;
}

interface DashboardStats {
  todaySales: number;
  totalProducts: number;
  lowStockItems: number;
  recentSales: Sale[];
}

export type { Sale, DashboardStats };
