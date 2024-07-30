// UpdateItem.js

import { useState } from "react";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Correct the path according to your project structure

const UpdateItem = ({ open, onClose, item, fetchItems }) => {
  const [updatedItem, setUpdatedItem] = useState({ ...item });

  const handleUpdate = async () => {
    try {
      const itemRef = doc(db, "pantryItems", item.id);
      await updateDoc(itemRef, updatedItem);
      fetchItems(item.userId); // Refresh items
      onClose();
    } catch (err) {
      console.error("Error updating item: ", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Item</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Item Name"
            value={updatedItem.name}
            onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Quantity"
            value={updatedItem.quantity}
            onChange={(e) => setUpdatedItem({ ...updatedItem, quantity: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Expiration Date"
            type="date"
            value={updatedItem.expirationDate}
            onChange={(e) => setUpdatedItem({ ...updatedItem, expirationDate: e.target.value })}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={updatedItem.category}
              onChange={(e) => setUpdatedItem({ ...updatedItem, category: e.target.value })}
            >
              {["Fruits", "Vegetables", "Dairy", "Meat", "Grains", "Snacks"].map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateItem;
