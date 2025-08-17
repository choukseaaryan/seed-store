import React, { useEffect, useState } from "react";
import { Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { customerService } from "../services";
import toast from "react-hot-toast";
import type { Customer } from "../types/models";

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pinCode: "",
    contactNumber: "",
  });

  // Function to fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.getAll();
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async () => {
    if (!formData.name.trim() || !formData.contactNumber.trim()) {
      toast.error("Name and contact number are required!");
      return;
    }

    try {
      const response = await customerService.create(formData);
      if (response.status === 201) {
        toast.success("Customer added successfully!");
        resetForm();
        setIsOpen(false);
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer");
    }
  };

  const handleEditCustomer = async () => {
    if (!editingCustomer || !formData.name.trim() || !formData.contactNumber.trim()) {
      toast.error("Name and contact number are required!");
      return;
    }

    try {
      const response = await customerService.update(editingCustomer.id, formData);
      if (response.status === 200) {
        toast.success("Customer updated successfully!");
        resetForm();
        setEditingCustomer(null);
        setIsOpen(false);
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmed) return;

    try {
      const response = await customerService.delete(id);
      if (response.status === 200) {
        toast.success("Customer deleted successfully!");
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditingCustomer(null);
    setIsOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setFormData({
      name: customer.name,
      address: customer.address || "",
      pinCode: customer.pinCode || "",
      contactNumber: customer.contactNumber,
    });
    setEditingCustomer(customer);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
    setEditingCustomer(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      pinCode: "",
      contactNumber: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "pinCode",
      headerName: "Pin Code",
      flex: 1,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      flex: 1,
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
            onClick={() => handleDeleteCustomer(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={4}>
        <p className="text-2xl font-bold">Customers</p>
        <Button variant="contained" onClick={openAddModal}>
          Add Customer
        </Button>
      </Box>
      
      <Box mt={4}>
        <DataGrid
          loading={loading}
          rows={customers}
          columns={columns}
          label="Existing Customers"
          disableRowSelectionOnClick
          showToolbar
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </Box>

      {/* Add/Edit Customer Modal */}
      <Dialog open={isOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingCustomer ? "Edit Customer" : "Add Customer"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Name *"
            placeholder="Enter customer name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
            required
          />
          <TextField
            label="Address"
            placeholder="Enter address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Pin Code"
            placeholder="Enter pin code"
            value={formData.pinCode}
            onChange={(e) => handleInputChange("pinCode", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact Number *"
            placeholder="Enter contact number"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={editingCustomer ? handleEditCustomer : handleAddCustomer}
          >
            {editingCustomer ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomersPage;
