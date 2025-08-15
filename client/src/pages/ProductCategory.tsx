import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../services/api";
import toast from "react-hot-toast";

const ProductCategory : React.FC = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/product-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      // Show error if category name is empty
      toast.error("Category name cannot be empty!");
      return;
    }

    const response = await api.post("/product-categories", { name: categoryName });
    if (response.status === 201) {
      // Category added successfully
      setCategoryName("");
      fetchCategories();
    }
  };

  const handleEditCategory = async (id: string) => {
    const newName = prompt("Enter new category name:");
    if (!newName?.trim()) return;

    const response = await api.patch(`/product-categories/${id}`, { name: newName });
    if (response.status === 200) {
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    const response = await api.delete(`/product-categories/${id}`);
    if (response.status === 200) {
      fetchCategories();
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Category Name",
      flex: 1,
      maxWidth: 800,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      maxWidth: 250,
      renderCell: (params: any) => (
        <Box display="flex" gap={1} my={0.5}>
          <Button
            variant="outlined"
            onClick={() => handleEditCategory(params.row.id)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
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
      <p className="text-2xl font-bold mb-8">Product Categories</p>
      <Box className="flex">
        <TextField
          size="small"
          label="Category Name"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleAddCategory}
          style={{ marginLeft: 12 }}
        >
          Add Category
        </Button>
      </Box>
      <Box
        mt={4}
      >
        {/* Render existing categories in a table along with a delete and edit button */}
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
    </>
  );
};

export default ProductCategory;