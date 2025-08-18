import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { customerService } from '../services';
import { useQueryClient } from '@tanstack/react-query';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customerId: string) => void;
}

export default function CustomerModal({ isOpen, onClose, onCustomerCreated }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    address: '',
    pinCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const queryClient = useQueryClient();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await customerService.create(formData);
      const customerId = response.data.data.id;
      
      // Invalidate customers query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      onCustomerCreated(customerId);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        contactNumber: '',
        address: '',
        pinCode: ''
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      setErrors({ submit: 'Failed to create customer. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box className="space-y-4">
            <TextField
              label="Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="Enter customer name"
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Contact Number *"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber}
              placeholder="Enter 10-digit contact number"
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter address (optional)"
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="PIN Code"
              value={formData.pinCode}
              onChange={(e) => handleInputChange('pinCode', e.target.value)}
              placeholder="Enter PIN code (optional)"
              fullWidth
              variant="outlined"
            />

            {errors.submit && (
              <Typography color="error" variant="body2">{errors.submit}</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions className="pt-4">
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            Create Customer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
