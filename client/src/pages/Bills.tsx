import React, { useEffect, useState } from "react";
import { Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { billService, customerService, productService } from "../services";
import toast from "react-hot-toast";
import type { Bill, Customer, Product } from "../types/models";

const BillsPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    invoiceNo: "",
    date: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    paymentMethod: 'CASH' as 'CASH' | 'CREDIT',
    saleStatus: 'PAID' as 'PAID' | 'VOID' | 'REFUND',
    syncStatus: 'PENDING' as 'PENDING' | 'SUCCESS' | 'FAILED',
    billItems: [] as Array<{
      productId: string;
      quantity: number;
      price: number;
    }>,
  });

  // Function to fetch bills
  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await billService.getAll();
      setBills(response.data.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch customers and products for dropdowns
  const fetchDropdownData = async () => {
    try {
      const [customersResponse, productsResponse] = await Promise.all([
        customerService.getAll(),
        productService.getAll(),
      ]);
      setCustomers(customersResponse.data.data);
      setProducts(productsResponse.data.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchBills();
    fetchDropdownData();
  }, []);

  const handleEditBill = async () => {
    if (!editingBill || !formData.customerId || !formData.invoiceNo || formData.billItems.length === 0) {
      toast.error("Customer, invoice number, and at least one item are required!");
      return;
    }

    try {
      const response = await billService.update(editingBill.id, formData as Partial<Bill>);
      if (response.status === 200) {
        toast.success("Bill updated successfully!");
        resetForm();
        setEditingBill(null);
        setIsOpen(false);
        fetchBills();
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error("Failed to update bill");
    }
  };

  const handleDeleteBill = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this bill?");
    if (!confirmed) return;

    try {
      const response = await billService.delete(id);
      if (response.status === 200) {
        toast.success("Bill deleted successfully!");
        fetchBills();
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast.error("Failed to delete bill");
    }
  };

  const openEditModal = (bill: Bill) => {
    setFormData({
      customerId: bill.customerId || "",
      invoiceNo: bill.invoiceNo,
      date: bill.date.split('T')[0],
      totalAmount: bill.totalAmount,
      paymentMethod: bill.paymentMethod,
      saleStatus: bill.saleStatus,
      syncStatus: bill.syncStatus,
      billItems: bill.billItems?.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })) || [],
    });
    setEditingBill(bill);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
    setEditingBill(null);
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      invoiceNo: "",
      date: new Date().toISOString().split('T')[0],
      totalAmount: 0,
      paymentMethod: 'CASH',
      saleStatus: 'PAID',
      syncStatus: 'PENDING',
      billItems: [],
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addBillItem = () => {
    setFormData(prev => ({
      ...prev,
      billItems: [...prev.billItems, { productId: "", quantity: 1, price: 0 }],
    }));
  };

  const removeBillItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      billItems: prev.billItems.filter((_, i) => i !== index),
    }));
  };

  const updateBillItem = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      billItems: prev.billItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const calculateTotal = () => {
    const total = formData.billItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    // Update the total amount in form data
    if (total !== formData.totalAmount) {
      setFormData(prev => ({ ...prev, totalAmount: total }));
    }
    return total;
  };

  const columns: GridColDef[] = [
    {
      field: "invoiceNo",
      headerName: "Invoice No",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <span>{params.row.customer?.name || 'N/A'}</span>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      valueFormatter: (params) => `₹${params}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      maxWidth: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" gap={1} my={0.5}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => openEditModal(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteBill(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <p className="text-2xl font-bold">Bills</p>
      
      <Box mt={4}>
        <DataGrid
          loading={loading}
          rows={bills}
          columns={columns}
          label="Existing Bills"
          disableRowSelectionOnClick
          showToolbar
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </Box>

      <Dialog open={isOpen} onClose={closeModal} fullWidth maxWidth="md">
        <DialogTitle>
          Edit Bill
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              select
              label="Customer *"
              value={formData.customerId}
              onChange={(e) => handleInputChange("customerId", e.target.value)}
              fullWidth
              margin="normal"
              required
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Invoice No *"
              placeholder="Enter invoice number"
              value={formData.invoiceNo}
              onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Date *"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <h4>Bill Items</h4>
              <Button variant="outlined" size="small" onClick={addBillItem}>
                Add Item
              </Button>
            </Box>
            {formData.billItems.map((item, index) => (
              <Box key={index} display="flex" gap={2} mb={1} alignItems="center">
                <TextField
                  select
                  label="Product"
                  value={item.productId}
                  onChange={(e) => updateBillItem(index, "productId", e.target.value)}
                  fullWidth
                  size="small"
                  required
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.itemName}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateBillItem(index, "quantity", parseInt(e.target.value))}
                  size="small"
                  required
                  sx={{ width: 100 }}
                />
                <TextField
                  label="Price"
                  type="number"
                  value={item.price}
                  onChange={(e) => updateBillItem(index, "price", parseFloat(e.target.value))}
                  size="small"
                  required
                  sx={{ width: 100 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => removeBillItem(index)}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" gap={2}>
              <TextField
                select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value as 'CASH' | 'CREDIT')}
                size="small"
                sx={{ width: 150 }}
              >
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="CREDIT">Credit</MenuItem>
              </TextField>
              <TextField
                select
                label="Sale Status"
                value={formData.saleStatus}
                onChange={(e) => handleInputChange("saleStatus", e.target.value as 'PAID' | 'VOID' | 'REFUND')}
                size="small"
                sx={{ width: 150 }}
              >
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="VOID">Void</MenuItem>
                <MenuItem value="REFUND">Refund</MenuItem>
              </TextField>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <h4>Total: ₹{calculateTotal()}</h4>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleEditBill}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BillsPage;
