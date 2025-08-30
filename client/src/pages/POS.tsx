import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CircularProgress, Button, TextField, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CustomerModal, ReceiptModal } from '../components';
import { productService, billService } from '../services';
import { useCustomers } from '../hooks/useCustomers';
import type { Product, Customer, Bill } from '../types/models';
import { useHotkeys } from 'react-hotkeys-hook';

interface BillItem {
  id: string;
  productId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

interface POSFormData {
  invoiceNo: string;
  date: string;
  contactNumber: string;
  addressLine1: string;
  search: string;
  customerName: string;
  crop: string;
  itemName: string;
  amountPerUnit: string;
  itemQuantity: string;
}

export default function POS() {
  const [formData, setFormData] = useState<POSFormData>({
    invoiceNo: '',
    date: new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }),
    contactNumber: '',
    addressLine1: '',
    search: '',
    customerName: '',
    crop: '',
    itemName: '',
    amountPerUnit: '',
    itemQuantity: '1'
  });

  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [focusedRowIndex, setFocusedRowIndex] = useState(0);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedBill, setCompletedBill] = useState<Bill | null>(null);
  const [isProcessingBill, setIsProcessingBill] = useState(false);
  const [cashDiscount, setCashDiscount] = useState(0);

  const queryClient = useQueryClient();
  const contactNumberRef = useRef<HTMLInputElement>(null);
  const itemNameRef = useRef<HTMLInputElement>(null);
  const itemQuantityRef = useRef<HTMLInputElement>(null);

  // Generate invoice number on component mount
  useEffect(() => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    setFormData(prev => ({ ...prev, invoiceNo: `${timestamp}${random}` }));
  }, []);

  // Queries
  const { data: products } = useQuery({
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
      setBillItems([]);
      setSelectedCustomer(null);
      setFormData(prev => ({
        ...prev,
        contactNumber: '',
        addressLine1: '',
        customerName: '',
        crop: '',
        itemName: '',
        amountPerUnit: '',
        itemQuantity: '1'
      }));
      setCashDiscount(0);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error creating bill:', error);
      alert('Failed to generate bill. Please try again.');
    },
    onSettled: () => {
      setIsProcessingBill(false);
    },
  });

  // Debounced search for products
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.search.trim()) {
        const filtered = products?.filter(product =>
          product.itemName?.toLowerCase().includes(formData.search.toLowerCase()) ||
          product.itemCode?.toLowerCase().includes(formData.search.toLowerCase())
        ) || [];
        setSearchResults(filtered);
        setFocusedRowIndex(0);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData.search, products]);

  // Customer search by contact number
  const handleContactNumberEnter = () => {
    if (!formData.contactNumber.trim()) return;

    const customer = customers?.find(c => c.contactNumber === formData.contactNumber);
    if (customer) {
      setSelectedCustomer(customer);
      setFormData(prev => ({
        ...prev,
        customerName: customer.name,
        addressLine1: customer.address || '',
        crop: ''
      }));
    } else {
      // Customer not found, allow manual entry
      setSelectedCustomer(null);
      setFormData(prev => ({
        ...prev,
        customerName: '',
        addressLine1: '',
        crop: ''
      }));
    }
  };

  // Handle item selection from search results
  const handleItemSelect = (product: Product) => {
    setFormData(prev => ({
      ...prev,
      itemName: product.itemName,
      amountPerUnit: product.price.toString(),
      itemQuantity: '1'
    }));
    setSearchResults([]);
    setFormData(prev => ({ ...prev, search: '' }));
    
    // Focus on quantity field
    setTimeout(() => itemQuantityRef.current?.focus(), 100);
  };

  // Add item to bill
  const handleAddItem = () => {
    if (!formData.itemName || !formData.amountPerUnit || !formData.itemQuantity) return;

    const quantity = parseFloat(formData.itemQuantity);
    const price = parseFloat(formData.amountPerUnit);
    const total = quantity * price;

    const newItem: BillItem = {
      id: Date.now().toString(),
      productId: '', // Will be set when we have the actual product
      itemCode: '', // Will be set when we have the actual product
      itemName: formData.itemName,
      quantity,
      price,
      total
    };

    setBillItems(prev => [...prev, newItem]);
    
    // Clear item fields
    setFormData(prev => ({
      ...prev,
      itemName: '',
      amountPerUnit: '',
      itemQuantity: '1'
    }));

    // Focus back to item name for next item
    setTimeout(() => itemNameRef.current?.focus(), 100);
  };

  // Update bill item quantity
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;

    setBillItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    ));
  };

  // Remove bill item
  const handleRemoveItem = (itemId: string) => {
    setBillItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Calculate totals
  const grossAmount = billItems.reduce((sum, item) => sum + item.total, 0);
  const netAmount = grossAmount - cashDiscount;

  // Generate bill
  const handleGenerateBill = async () => {
    if (billItems.length === 0) {
      alert('Please add at least one item to the bill!');
      return;
    }

    if (!formData.customerName.trim()) {
      alert('Please enter customer name!');
      return;
    }

    setIsProcessingBill(true);

    try {
      const billData = {
        customerId: selectedCustomer?.id,
        paymentMethod: 'CASH' as const,
        billItems: billItems.map(item => ({
          productId: item.productId || 'temp-id', // You might want to handle this differently
          quantity: item.quantity,
          price: item.price
        }))
      };

      await createBillMutation.mutateAsync(billData);
    } catch (error) {
      console.error('Error generating bill:', error);
    }
  };

  // Keyboard shortcuts
  useHotkeys('f2', () => {
    console.log('F2 pressed - Select Party', contactNumberRef.current);
    contactNumberRef.current?.focus();
  });

  useHotkeys('f3', () => {
    console.log('F3 pressed - Add Party');
    setShowCustomerModal(true);
  });

  useHotkeys('f4', () => {
    console.log('F4 pressed - Add Item');
    itemNameRef.current?.focus();
  });

  useHotkeys('f5', () => {
    // Select previous bill - you can implement this functionality
    console.log('F5 pressed - Select Previous Bill');
  });

  // Grid navigation
  useHotkeys('up', (e) => {
    if (searchResults.length > 0) {
      e.preventDefault();
      setFocusedRowIndex(prev => prev > 0 ? prev - 1 : searchResults.length - 1);
    }
  });

  useHotkeys('down', (e) => {
    if (searchResults.length > 0) {
      e.preventDefault();
      setFocusedRowIndex(prev => prev < searchResults.length - 1 ? prev + 1 : 0);
    }
  });

  useHotkeys('enter', (e) => {
    if (searchResults.length > 0 && focusedRowIndex >= 0) {
      e.preventDefault();
      const selectedProduct = searchResults[focusedRowIndex];
      if (selectedProduct) {
        handleItemSelect(selectedProduct);
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-blue-800 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="text-xl font-bold">POS Sale</div>
        <div className="flex items-center gap-4">
          <span>Administrator</span>
          <span>Last Login: {new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Section - Bill and Customer Information */}
          <div className="space-y-4">
            <form onSubmit={handleGenerateBill} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number:
                </label>
                <TextField
                  value={formData.invoiceNo}
                  fullWidth
                  size="small"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time:
                </label>
                <TextField
                  value={formData.date}
                  fullWidth
                  size="small"
                />
              </div>
            </form>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number:
              </label>
              <TextField
                autoFocus
                inputRef={contactNumberRef}
                value={formData.contactNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleContactNumberEnter()}
                fullWidth
                size="small"
                placeholder="Press 'Enter' to Select Party"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1:
              </label>
              <TextField
                value={formData.addressLine1}
                onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                fullWidth
                size="small"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search:
              </label>
              <TextField
                value={formData.search}
                onChange={(e) => setFormData(prev => ({ ...prev, search: e.target.value }))}
                fullWidth
                size="small"
                placeholder="Search for items..."
              />
            </div>
          </div>

          {/* Right Section - Customer and Item Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name*:
              </label>
              <TextField
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                fullWidth
                size="small"
                required
                className="border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop:
              </label>
              <TextField
                value={formData.crop}
                onChange={(e) => setFormData(prev => ({ ...prev, crop: e.target.value }))}
                fullWidth
                size="small"
                placeholder="Press 'Enter' Inside Grid To Add"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name:
                </label>
                <TextField
                  inputRef={itemNameRef}
                  value={formData.itemName}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  fullWidth
                  size="small"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount / Unit:
                </label>
                <TextField
                  value={formData.amountPerUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, amountPerUnit: e.target.value }))}
                  fullWidth
                  size="small"
                  placeholder="Press 'Enter' To Add"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity:
                </label>
                <TextField
                  inputRef={itemQuantityRef}
                  value={formData.itemQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemQuantity: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  fullWidth
                  size="small"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Grid */}
        {searchResults.length > 0 && (
          <div className="mb-6">
            <Typography variant="h6" className="mb-2">Search Results</Typography>
            <TableContainer component={Paper} className="max-h-48 overflow-y-auto">
              <Table size="small">
                <TableHead>
                  <TableRow className="bg-blue-800">
                    <TableCell className="text-white font-bold">Item Name</TableCell>
                    <TableCell className="text-white font-bold">Item Code</TableCell>
                    <TableCell className="text-white font-bold">Price</TableCell>
                    <TableCell className="text-white font-bold">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((product, index) => (
                    <TableRow
                      key={product.id}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        index === focusedRowIndex ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => handleItemSelect(product)}
                    >
                      <TableCell>{product.itemName}</TableCell>
                      <TableCell>{product.itemCode}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.stockQty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" className="text-gray-600">
              Use ↑/↓ arrow keys to navigate, Enter to select
            </Typography>
          </div>
        )}

        {/* Bill Items Grid */}
        <div className="mb-6">
          <Typography variant="h6" className="mb-2">Bill Items</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="bg-blue-800">
                  <TableCell className="text-white font-bold">Item Name</TableCell>
                  <TableCell className="text-white font-bold">Quantity</TableCell>
                  <TableCell className="text-white font-bold">Amount / Unit</TableCell>
                  <TableCell className="text-white font-bold">Total Amount</TableCell>
                  <TableCell className="text-white font-bold">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No items added to bill
                    </TableCell>
                  </TableRow>
                ) : (
                  billItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseFloat(e.target.value) || 1)}
                          size="small"
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>₹{item.total}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <Typography variant="subtitle2" className="font-bold">Keyboard Shortcuts:</Typography>
            <div className="text-sm space-y-1">
              <div>Press 'F2' Select Party</div>
              <div>Press 'F3' To Add Party</div>
              <div>Press 'F4' To Add Item</div>
              <div>Press 'F5' To Select Previous Bill</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="contained"
              type="submit"
              disabled={isProcessingBill || billItems.length === 0}
              className="px-8"
            >
              {isProcessingBill ? <CircularProgress size={20} /> : 'Generate Bill'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.history.back()}
              className="px-8"
            >
              Close
            </Button>
          </div>

          {/* Bill Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Gross Amount:</span>
              <span>₹{grossAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Cash Discount:</span>
              <TextField
                type="number"
                value={cashDiscount}
                onChange={(e) => setCashDiscount(parseFloat(e.target.value) || 0)}
                size="small"
                sx={{ width: 100 }}
              />
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Net Amount:</span>
              <span>₹{netAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onCustomerCreated={(customerId) => {
          const customer = customers?.find(c => c.id === customerId);
          if (customer) {
            setSelectedCustomer(customer);
            setFormData(prev => ({
              ...prev,
              contactNumber: customer.contactNumber,
              customerName: customer.name,
              addressLine1: customer.address || ''
            }));
          }
        }}
      />

      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        bill={completedBill}
      />
    </div>
  );
}
