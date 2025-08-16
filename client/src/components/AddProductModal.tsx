import React, { useState, useEffect } from "react";
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
import api from "../services/api";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh products after adding
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<any[]>([]);
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

  // Fetch categories for dropdown
  useEffect(() => {
    if (open) {
      api.get("/product-categories").then((res) => setCategories(res.data));
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/products", {
        ...form,
        price: form.price,
        stockQty: parseInt(form.stockQty, 10),
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating product:", err);
    }
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
          {categories.map((cat) => (
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
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
