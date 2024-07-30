import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import Edit Icon
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar"; // Import the Navbar component
import Filter from '../pages/api/Filter'; // Import the Filter component
import Search from '../pages/api/Search'; // Import the Search component
import UpdateItem from './api/update';

const Pantry = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", expirationDate: "", category: "" });
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState(["Fruits", "Vegetables", "Dairy", "Meat", "Grains", "Snacks"]); // Sample categories
  const [currentCategory, setCurrentCategory] = useState(''); // Current selected category for filtering
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false); // State to control UpdateItem dialog
  const [selectedItem, setSelectedItem] = useState(null); // Selected item to be updated

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
      if (!newItem.name || !newItem.quantity || !newItem.expirationDate || !newItem.category || !userId) {
        console.error("Please fill out all fields and ensure you are logged in.");
        return;
      }
      const itemWithUserId = { ...newItem, userId };
      const docRef = await addDoc(collection(db, "pantryItems"), itemWithUserId);
      const newItemWithId = { ...itemWithUserId, id: docRef.id };
      console.log("Added item:", newItemWithId); // Debug: Log added item
      setPantryItems([...pantryItems, newItemWithId]);
      setNewItem({ name: "", quantity: "", expirationDate: "", category: "" });
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

  const handleOpenUpdateDialog = (item) => {
    setSelectedItem(item);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedItem(null);
  };

  // Filter pantry items based on the selected category
  const filteredItems = currentCategory ? 
    pantryItems.filter(item => item.category === currentCategory) : 
    pantryItems;

  // Filter pantry items based on the search query
  const searchedItems = searchQuery ? 
    filteredItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) : 
    filteredItems;

  // Check if the item is expired
  const isExpired = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    return expDate < today;
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
          backgroundColor: '#212121', // Dark background
          padding: 3,
        }}
      >
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
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
            <FormControl fullWidth required sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              maxHeight: '450px', // Ensure this height matches or is less than the "Add New Item" box height
              overflowY: 'auto', // Enable vertical scrolling
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ color: "#0A6847", flexGrow: 1 }}>
                Pantry Items
              </Typography>
              <Filter
                categories={categories}
                currentCategory={currentCategory}
                onCategoryChange={setCurrentCategory}
              />
            </Box>
            <List>
              {searchedItems.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    backgroundColor: isExpired(item.expirationDate) ? 'IndianRed' : 'transparent', // Apply red background for expired items
                    color: isExpired(item.expirationDate) ? 'white' : 'inherit', // Text color adjustment
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity}, Expiration Date: ${item.expirationDate}, Category: ${item.category}`}
                  />
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpenUpdateDialog(item)}>
                    <EditIcon sx={{ color: "#F3CA52" }} /> {/* Pencil Icon */}
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon sx={{ color: "#DC0083" }} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
      {selectedItem && (
        <UpdateItem
          open={openUpdateDialog}
          onClose={handleCloseUpdateDialog}
          item={selectedItem}
          fetchItems={fetchItems}
        />
      )}
    </>
  );
};

export default Pantry;
