import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { productCategoryService, productService } from "../services";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh products after adding
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    categoryId: "",
    companyName: "",
    itemCode: "",
    itemName: "",
    technicalName: "",
    price: "",
    stockQty: "",
    subItemContainer: false,
  });

  const queryClient = useQueryClient();

  // Query for categories
  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const response = await productCategoryService.getAll();
      return response.data.data;
    },
    enabled: open, // Only fetch when modal is open
  });

  // Mutation for creating products
  const createProductMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      onSuccess();
      onClose();
      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => {
      console.error("Error creating product:", err);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    createProductMutation.mutate({
      ...form,
      price: parseFloat(form.price),
      stockQty: parseInt(form.stockQty, 10),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          label="Category"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {categories?.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Company Name"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Item Code"
          name="itemCode"
          value={form.itemCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Item Name"
          name="itemName"
          value={form.itemName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Technical Name"
          name="technicalName"
          value={form.technicalName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Stock Quantity"
          name="stockQty"
          type="number"
          value={form.stockQty}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.subItemContainer}
              onChange={handleChange}
              name="subItemContainer"
            />
          }
          label="Sub Item Container"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={createProductMutation.isPending}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
