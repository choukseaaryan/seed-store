import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner, Button, Input } from '../components/ui';
import api from '../services/api';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    },
  });

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existingItem = current.find((item) => item.id === product.id);
      if (existingItem) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const filteredProducts = products?.filter((product: Product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Products Section */}
        <div className="lg:w-2/3">
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts?.map((product: Product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-4 border rounded-lg hover:border-primary text-left"
              >
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-gray-500">₹{product.price}</p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stock}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Cart</h2>
          
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4 border-b">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            
            <Button className="w-full" disabled={cart.length === 0}>
              Complete Sale
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
