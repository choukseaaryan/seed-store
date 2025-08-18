import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import type { Bill } from '../types/models';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onPrint?: () => void;
}

export default function ReceiptModal({ isOpen, onClose, bill, onPrint }: ReceiptModalProps) {
  if (!bill) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Sale Receipt</DialogTitle>
      <DialogContent>
        <Box className="space-y-6">
          {/* Header */}
          <Box className="text-center border-b pb-4">
            <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-900">Seed Store</Typography>
            <Typography variant="body1" className="text-gray-600">Your Trusted Seed Partner</Typography>
            <Typography variant="body2" className="text-sm text-gray-500 mt-2">
              Invoice: {bill.invoiceNo} | Date: {formatDate(bill.date)}
            </Typography>
          </Box>

          {/* Customer Info */}
          {bill.customer && (
            <Box className="border-b pb-4">
              <Typography variant="h6" component="h3" className="font-semibold text-gray-900 mb-2">Customer Details</Typography>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{bill.customer.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Contact:</span>
                  <span className="ml-2 font-medium">{bill.customer.contactNumber}</span>
                </div>
                {bill.customer.address && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Address:</span>
                    <span className="ml-2 font-medium">{bill.customer.address}</span>
                  </div>
                )}
              </div>
            </Box>
          )}

          {/* Items */}
          <Box>
            <Typography variant="h6" component="h3" className="font-semibold text-gray-900 mb-3">Items</Typography>
            <div className="space-y-2">
              {bill.billItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <Typography variant="body1" className="font-medium text-gray-900">{item.product.itemName}</Typography>
                    <Typography variant="body2" className="text-sm text-gray-500">
                      {item.quantity} × ₹{item.price}
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography variant="body1" className="font-medium text-gray-900">₹{item.total}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </Box>

          {/* Payment Details */}
          <Box className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span>₹{bill.totalAmount}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Payment Method: {bill.paymentMethod}</p>
              <p>Status: {bill.saleStatus}</p>
            </div>
          </Box>

          {/* Footer */}
          <Box className="text-center text-sm text-gray-500 border-t pt-4">
            <p>Thank you for your purchase!</p>
            <p>For any queries, please contact us</p>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handlePrint}
        >
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
}
