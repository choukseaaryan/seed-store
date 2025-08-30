import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { supplierService } from "../services";
import toast from "react-hot-toast";
import type { Supplier } from "../types/models";

const SuppliersPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pinCode: "",
    contactPerson: "",
    contactNumber: "",
  });

  const queryClient = useQueryClient();

  // Query for suppliers
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await supplierService.getAll();
      return response.data.data;
    },
  });

  // Mutation for creating suppliers
  const createSupplierMutation = useMutation({
    mutationFn: supplierService.create,
    onSuccess: () => {
      toast.success("Supplier added successfully!");
      resetForm();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (error) => {
      console.error("Error creating supplier:", error);
      toast.error("Failed to create supplier");
    },
  });

  // Mutation for updating suppliers
  const updateSupplierMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) => 
      supplierService.update(id, data),
    onSuccess: () => {
      toast.success("Supplier updated successfully!");
      resetForm();
      setEditingSupplier(null);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (error) => {
      console.error("Error updating supplier:", error);
      toast.error("Failed to update supplier");
    },
  });

  // Mutation for deleting suppliers
  const deleteSupplierMutation = useMutation({
    mutationFn: supplierService.delete,
    onSuccess: () => {
      toast.success("Supplier deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (error) => {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier");
    },
  });

  const handleAddSupplier = async () => {
    if (!formData.name.trim() || !formData.contactNumber.trim()) {
      toast.error("Name and contact number are required!");
      return;
    }

    createSupplierMutation.mutate(formData);
  };

  const handleEditSupplier = async () => {
    if (!editingSupplier || !formData.name.trim() || !formData.contactNumber.trim()) {
      toast.error("Name and contact number are required!");
      return;
    }

    updateSupplierMutation.mutate({ id: editingSupplier.id, data: formData });
  };

  const handleDeleteSupplier = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this supplier?");
    if (!confirmed) return;

    deleteSupplierMutation.mutate(id);
  };

  const openAddModal = () => {
    resetForm();
    setEditingSupplier(null);
    setIsOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setFormData({
      name: supplier.name,
      address: supplier.address || "",
      pinCode: supplier.pinCode || "",
      contactPerson: supplier.contactPerson || "",
      contactNumber: supplier.contactNumber,
    });
    setEditingSupplier(supplier);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
    setEditingSupplier(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      pinCode: "",
      contactPerson: "",
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
      field: "contactPerson",
      headerName: "Contact Person",
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
            onClick={() => handleDeleteSupplier(params.row.id)}
            disabled={deleteSupplierMutation.isPending}
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
        <p className="text-2xl font-bold">Suppliers</p>
        <Button variant="contained" onClick={openAddModal}>
          Add Supplier
        </Button>
      </Box>
      
      <Box mt={4}>
        <DataGrid
          loading={isLoading}
          rows={suppliers || []}
          columns={columns}
          label="Existing Suppliers"
          disableRowSelectionOnClick
          showToolbar
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </Box>

      <Dialog open={isOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingSupplier ? "Edit Supplier" : "Add Supplier"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Name *"
            placeholder="Enter supplier name"
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
            label="Contact Person"
            placeholder="Enter contact person name"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
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
            onClick={editingSupplier ? handleEditSupplier : handleAddSupplier}
            disabled={createSupplierMutation.isPending || updateSupplierMutation.isPending}
          >
            {editingSupplier ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SuppliersPage;
