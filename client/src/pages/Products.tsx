import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import api from "../services/api";
import AddProductModal from "../components/AddProductModal";

const Products : React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    const response = await api.delete(`/products/${id}`);
    if (response.status === 200) {
      fetchProducts();
    }
  };

  const columns: GridColDef[] = [
    {
      field: "itemName",
      headerName: "Item Name",
      flex: 1,
    },
    {
      field: "itemCode",
      headerName: "Item Code",
      flex: 1,
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
    },
    {
      field: "stockQty",
      headerName: "Stock",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      renderCell: (params: any) => (
        <span>{params.row.category.name}</span>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      maxWidth: 250,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteProduct(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={4}>
        <p className="text-2xl font-bold">Products</p>
        <Button variant="contained" onClick={() => setIsOpen(true)}>
          Add Product
        </Button>
      </Box>
      <Box
        mt={4}
      >
        {/* Render existing categories in a table along with a delete and edit button */}
        <DataGrid
          loading={loading}
          rows={products}
          columns={columns}
          label="Existing Products"
          disableRowSelectionOnClick
          showToolbar
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </Box>

      {/* Add Product Modal */}
      <AddProductModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={fetchProducts}
      />
    </>
  );
};

export default Products;