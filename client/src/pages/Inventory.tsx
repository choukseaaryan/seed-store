import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress, Button, TextField, Box, Typography } from '@mui/material';
import { productService } from '../services';
import type { Product } from '../types/models';

// This is not used anywhere. Product page is used instead
export default function Inventory() {
  const [search, setSearch] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productService.getAll();
      return response.data.data;
    },
  });

  const filteredProducts = products?.filter((product: Product) =>
    product.itemName?.toLowerCase().includes(search.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="32vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 py-8">
      <Box className="sm:flex sm:items-center sm:justify-between mb-8">
        <Typography variant="h4" component="h1" className="text-2xl font-bold text-gray-900">Inventory</Typography>
        <Button variant="contained">Add Product</Button>
      </Box>

      <Box className="mb-6">
        <TextField
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </Box>

      {filteredProducts?.length ?? 0 ? (
        <Box className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Price
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th className="relative py-3.5 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts?.map((product: Product) => (
                <tr key={product.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {product.itemName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {product.category?.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ₹{product.price}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {product.stockQty}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <Button size="small" variant="outlined">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      ) : (
        <Box className="text-center py-12">
          <Typography variant="h6" component="h3" className="text-sm font-semibold text-gray-900">
            No products found
          </Typography>
          <Typography variant="body2" className="mt-1 text-sm text-gray-500">
            Get started by creating a new product
          </Typography>
          <Box className="mt-6">
            <Button variant="contained">Add Product</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
