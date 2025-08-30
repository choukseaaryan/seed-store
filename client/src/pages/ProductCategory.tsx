import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { productCategoryService } from "../services";
import toast from "react-hot-toast";
import type { ProductCategory } from "../types/models";

const ProductCategoryPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  const queryClient = useQueryClient();

  // Query for categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const response = await productCategoryService.getAll();
      return response.data.data;
    },
  });

  // Mutation for creating categories
  const createCategoryMutation = useMutation({
    mutationFn: productCategoryService.create,
    onSuccess: () => {
      toast.success("Category added successfully!");
      setFormData({ name: "" });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    },
  });

  // Mutation for updating categories
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductCategory> }) => 
      productCategoryService.update(id, data),
    onSuccess: () => {
      toast.success("Category updated successfully!");
      setFormData({ name: "" });
      setEditingCategory(null);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    },
  });

  // Mutation for deleting categories
  const deleteCategoryMutation = useMutation({
    mutationFn: productCategoryService.delete,
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    },
  });

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }

    createCategoryMutation.mutate({ name: formData.name });
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !formData.name.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }

    updateCategoryMutation.mutate({ id: editingCategory.id, data: { name: formData.name } });
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    deleteCategoryMutation.mutate(id);
  };

  const openAddModal = () => {
    setFormData({ name: "" });
    setEditingCategory(null);
    setIsOpen(true);
  };

  const openEditModal = (category: ProductCategory) => {
    setFormData({ name: category.name });
    setEditingCategory(category);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({ name: "" });
    setEditingCategory(null);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Category Name",
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
            onClick={() => handleDeleteCategory(params.row.id)}
            disabled={deleteCategoryMutation.isPending}
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
        <p className="text-2xl font-bold">Product Categories</p>
        <Button variant="contained" onClick={openAddModal}>
          Add Category
        </Button>
      </Box>
      
      <Box mt={4}>
        <DataGrid
          loading={isLoading}
          rows={categories || []}
          columns={columns}
          label="Existing Categories"
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
          {editingCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Category Name"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            fullWidth
            margin="normal"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={editingCategory ? handleEditCategory : handleAddCategory}
            disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
          >
            {editingCategory ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCategoryPage;