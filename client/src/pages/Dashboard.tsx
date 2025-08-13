import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner, EmptyState, Button } from '../components/ui';
import { Link } from 'react-router-dom';
import type { DashboardStats } from '../types/dashboard';
import api from '../services/api';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats');
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/pos">
          <Button>New Sale</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Today's Sales</h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ₹{stats?.todaySales || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats?.totalProducts || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Low Stock Items</h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats?.lowStockItems || 0}
          </p>
        </div>
      </div>

      {/* Recent Sales Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Sales</h2>
        </div>
        <div className="p-6">
          {(stats?.recentSales?.length ?? 0) > 0 ? (
            <div className="flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {stats?.recentSales?.map((sale) => (
                  <li key={sale.id} className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Invoice #{sale.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(sale.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{sale.total}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState
              title="No recent sales"
              description="Start making sales to see them here"
              action={
                <Link to="/pos">
                  <Button size="sm">Create New Sale</Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
