import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CircularProgress, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { CustomerModal, ReceiptModal } from '../components';
import { productService, billService } from '../services';
import { useCustomers } from '../hooks/useCustomers';
import type { Product, Customer, Bill } from '../types/models';

interface CartItem extends Product {
  quantity: number;
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT'>('CASH');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedBill, setCompletedBill] = useState<Bill | null>(null);
  const [isProcessingSale, setIsProcessingSale] = useState(false);

  const queryClient = useQueryClient();

  // Queries
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productService.getAll();
      return response.data.data;
    },
  });

  const { data: customers } = useCustomers();

  // Mutations
  const createBillMutation = useMutation({
    mutationFn: billService.createBill,
    onSuccess: (response) => {
      const bill = response.data;
      setCompletedBill(bill);
      setShowReceipt(true);
      setCart([]);
      setSelectedCustomer(null);
      setPaymentMethod('CASH');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error creating bill:', error);
      alert('Failed to complete sale. Please try again.');
    },
    onSettled: () => {
      setIsProcessingSale(false);
    },
  });

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stockQty <= 0) {
      alert('Product is out of stock!');
      return;
    }

    setCart((current) => {
      const existingItem = current.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stockQty) {
          alert('Cannot add more items. Stock limit reached!');
          return current;
        }
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
    
    const product = products?.find(p => p.id === productId);
    if (product && quantity > product.stockQty) {
      alert('Cannot add more items. Stock limit reached!');
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setPaymentMethod('CASH');
  };

  // Customer operations
  const handleCustomerSelect = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
  };

  const handleCustomerCreated = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
    }
  };

  // Sale completion
  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (paymentMethod === 'CREDIT' && !selectedCustomer) {
      alert('Please select a customer for credit sales!');
      return;
    }

    setIsProcessingSale(true);

    try {
      const billData = {
        customerId: selectedCustomer?.id,
        paymentMethod,
        billItems: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await createBillMutation.mutateAsync(billData);
    } catch (error) {
      console.error('Error completing sale:', error);
    }
  };

  // Filtered products
  const filteredProducts = products?.filter((product: Product) =>
    product.itemName?.toLowerCase().includes(search.toLowerCase()) ||
    product.itemCode?.toLowerCase().includes(search.toLowerCase())
  );

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  if (productsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="32vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section - Products and Customer */}
        <div className="lg:w-2/3 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <Typography variant="h6" component="h2" className="text-lg font-medium text-gray-900 mb-4">Customer Details</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer
                </label>
                <div className="flex gap-2">
                  <FormControl fullWidth>
                    <InputLabel>Select Customer</InputLabel>
                    <Select
                      value={selectedCustomer?.id || ''}
                      onChange={(e) => handleCustomerSelect(e.target.value)}
                      label="Select Customer"
                    >
                      <MenuItem value="">Select Customer</MenuItem>
                      {customers?.map(c => (
                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setShowCustomerModal(true)}
                  >
                    +
                  </Button>
                </div>
                {selectedCustomer && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{selectedCustomer.contactNumber}</p>
                    {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'CASH' | 'CREDIT')}
                    label="Payment Method"
                  >
                    <MenuItem value="CASH">Cash</MenuItem>
                    <MenuItem value="CREDIT">Credit</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Product Search */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <TextField
                type="search"
                placeholder="Search products by name or code..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts?.map((product: Product) => (
                <Button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stockQty <= 0}
                  variant="contained"
                  fullWidth
                  sx={{ flexDirection: 'column', height: 'auto', py: 2 }}
                >
                  <Typography variant="body2" className="font-medium truncate">{product.itemName}</Typography>
                  <Typography variant="caption">₹{product.price}</Typography>
                  <Typography variant="caption">
                    Stock: {product.stockQty}
                  </Typography>
                  {product.stockQty <= 0 && (
                    <Typography variant="caption" color="error" className="font-medium">Out of Stock</Typography>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Cart */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h6" component="h2" className="text-lg font-medium text-gray-900">Cart</Typography>
              {cart.length > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearCart}
                >
                  Clear
                </Button>
              )}
            </div>
            
            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                      <Typography variant="body2" className="font-medium text-gray-900 truncate">{item.itemName}</Typography>
                      <Typography variant="caption" className="text-gray-500">₹{item.price}</Typography>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={cart.length === 0 || isProcessingSale}
                  variant="contained"
                  fullWidth
                  onClick={handleCompleteSale}
                >
                  {isProcessingSale ? <CircularProgress size={20} /> : 'Complete Sale'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onCustomerCreated={handleCustomerCreated}
      />

      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        bill={completedBill}
      />
    </div>
  );
}
