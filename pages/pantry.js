// pages/pantry.js
import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar"; // Import the Navbar component

const Pantry = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", expirationDate: "" });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchItems(user.uid); // Fetch items when user is authenticated
      } else {
        setUserId(null);
        setPantryItems([]); // Clear items if no user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const fetchItems = async (userId) => {
    try {
      const q = query(collection(db, "pantryItems"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      console.log("Fetched items:", items); // Debug: Log fetched items
      setPantryItems(items);
    } catch (err) {
      console.error("Error fetching items: ", err);
    }
  };

  const handleAddItem = async () => {
    try {
      if (!newItem.name || !newItem.quantity || !newItem.expirationDate || !userId) {
        console.error("Please fill out all fields and ensure you are logged in.");
        return;
      }
      const itemWithUserId = { ...newItem, userId };
      const docRef = await addDoc(collection(db, "pantryItems"), itemWithUserId);
      const newItemWithId = { ...itemWithUserId, id: docRef.id };
      console.log("Added item:", newItemWithId); // Debug: Log added item
      setPantryItems([...pantryItems, newItemWithId]);
      setNewItem({ name: "", quantity: "", expirationDate: "" });
    } catch (err) {
      console.error("Error adding item: ", err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "pantryItems", id));
      console.log("Deleted item with id:", id); // Debug: Log deleted item id
      setPantryItems(pantryItems.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting item: ", err);
    }
  };

  return (
    <>
      <Navbar /> {/* Include the Navbar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#F6E9B2', // Light Yellow background
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 3, // Space between the boxes
            width: '100%',
            maxWidth: '1200px', // Adjust this as needed
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '500px', // Adjust as needed
              padding: 3,
              backgroundColor: '#FFFFFF', // White background for the box
              borderRadius: 1,
              boxShadow: 3,
              textAlign: 'left',
              border: `1px solid #0A6847`, // Dark Green border
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ color: "#0A6847" }}>
              Add New Item
            </Typography>
            <TextField
              label="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            <TextField
              label="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            <TextField
              label="Expiration Date"
              type="date"
              value={newItem.expirationDate}
              onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
              fullWidth
              required
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button 
              onClick={handleAddItem} 
              variant="contained" 
              sx={{ 
                mt: 2,
                backgroundColor: "#F3CA52", // Yellow background
                color: "#0A6847", // Dark Green text
                '&:hover': {
                  backgroundColor: "#F6E9B2", // Light Yellow on hover
                }
              }}
            >
              Add Item
            </Button>
          </Box>

          <Box
            sx={{
              width: '100%',
              maxWidth: '500px', // Adjust as needed
              padding: 3,
              backgroundColor: '#FFFFFF', // White background for the box
              borderRadius: 1,
              boxShadow: 3,
              textAlign: 'left',
              border: `1px solid #0A6847`, // Dark Green border
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: "#0A6847" }}>
              Pantry Items
            </Typography>
            <List>
              {pantryItems.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity}, Expiration Date: ${item.expirationDate}`}
                  />
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon sx={{ color: "#DC0083" }} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Pantry;
