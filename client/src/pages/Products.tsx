import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Box } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { productService } from "../services/productService";
import AddProductModal from "../components/AddProductModal";

const Products : React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Query for products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productService.getAll();
      return response.data.data;
    },
  });

  // Mutation for deleting products
  const deleteProductMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
    },
  });

  const handleDeleteProduct = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    deleteProductMutation.mutate(id);
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
      renderCell: (params: GridRenderCellParams) => (
        <span>{params.row.category.name}</span>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      maxWidth: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteProduct(params.row.id)}
          disabled={deleteProductMutation.isPending}
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
      <Box mt={4}>
        <DataGrid
          loading={isLoading}
          rows={products || []}
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

      <AddProductModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }}
      />
    </>
  );
};

export default Products;