import React, { useEffect, useState } from "react";
import { Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { productCategoryService } from "../services";
import toast from "react-hot-toast";
import type { ProductCategory } from "../types/models";

const ProductCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  // Function to fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await productCategoryService.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }

    try {
      const response = await productCategoryService.create({ name: formData.name });
      if (response.status === 201) {
        toast.success("Category added successfully!");
        setFormData({ name: "" });
        setIsOpen(false);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !formData.name.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }

    try {
      const response = await productCategoryService.update(editingCategory.id, { name: formData.name });
      if (response.status === 200) {
        toast.success("Category updated successfully!");
        setFormData({ name: "" });
        setEditingCategory(null);
        setIsOpen(false);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      const response = await productCategoryService.delete(id);
      if (response.status === 200) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
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
          loading={loading}
          rows={categories}
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

      {/* Add/Edit Category Modal */}
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
          >
            {editingCategory ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCategoryPage;