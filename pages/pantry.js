import { useState, useEffect } from "react";
import { db, auth, storage } from "../firebaseConfig"; // Import storage from firebaseConfig
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, FormControl, InputLabel, Select, MenuItem, Dialog, DialogContent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Camera icon
import UploadIcon from "@mui/icons-material/Upload"; // Upload icon
import ImageIcon from "@mui/icons-material/Image"; // Picture icon
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import Filter from '../pages/api/Filter';
import Search from '../pages/api/Search';
import UpdateItem from './api/update';

const Pantry = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", expirationDate: "", category: "", imageUrl: "" }); // Include imageUrl
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState(["Fruits", "Vegetables", "Dairy", "Meat", "Grains", "Snacks"]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [image, setImage] = useState(null); // State for image file
  const [imageDialogOpen, setImageDialogOpen] = useState(false); // State for image dialog
  const [selectedImageUrl, setSelectedImageUrl] = useState(""); // State for selected image URL

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchItems(user.uid);
      } else {
        setUserId(null);
        setPantryItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchItems = async (userId) => {
    try {
      const q = query(collection(db, "pantryItems"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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
      
      let imageUrl = "";
      if (image) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const itemWithUserId = { ...newItem, userId, imageUrl };
      const docRef = await addDoc(collection(db, "pantryItems"), itemWithUserId);
      const newItemWithId = { ...itemWithUserId, id: docRef.id };
      setPantryItems([...pantryItems, newItemWithId]);
      setNewItem({ name: "", quantity: "", expirationDate: "", category: "", imageUrl: "" });
      setImage(null); // Clear image state
    } catch (err) {
      console.error("Error adding item: ", err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "pantryItems", id));
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

  const handleCameraClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use 'user' for front camera
    input.onchange = (e) => handleFileInputChange(e);
    input.click();
  };
  
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Save the selected image to state
    }
  };
  

  const handleOpenImageDialog = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedImageUrl("");
  };

  const filteredItems = currentCategory ? 
    pantryItems.filter(item => item.category === currentCategory) : 
    pantryItems;

  const searchedItems = searchQuery ? 
    filteredItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) : 
    filteredItems;

  const isExpired = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    return expDate < today;
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#212121',
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
            gap: 3,
            width: '100%',
            maxWidth: '1200px',
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '500px',
              padding: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: 1,
              boxShadow: 3,
              textAlign: 'left',
              border: `1px solid #0A6847`,
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ color: "#0A6847" }}>
              Add New Item
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleCameraClick} sx={{ mr: 2 }}>
                <CameraAltIcon sx={{ color: "#0A6847" }} />
              </IconButton>
              <Button 
                component="label"
                variant="contained"
                sx={{ 
                  backgroundColor: "#F3CA52",
                  color: "#0A6847",
                  '&:hover': {
                    backgroundColor: "#F6E9B2",
                  }
                }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  hidden
                />
              </Button>
            </Box>
            {image && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>Selected Image:</Typography>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </Box>
            )}
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
                  backgroundColor: "#F3CA52",
                  color: "#0A6847",
                  '&:hover': {
                    backgroundColor: "#F6E9B2",
                  }
                }}
              >
                Add Item
              </Button>
            </Box>
  
            <Box
              sx={{
                width: '100%',
                maxWidth: '500px',
                padding: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 1,
                boxShadow: 3,
                textAlign: 'left',
                border: `1px solid #0A6847`,
                maxHeight: '450px',
                overflowY: 'auto',
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
                      backgroundColor: isExpired(item.expirationDate) ? 'IndianRed' : 'transparent',
                      color: isExpired(item.expirationDate) ? 'white' : 'inherit',
                    }}
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}, Expiration Date: ${item.expirationDate}, Category: ${item.category}`}
                    />
                    {item.imageUrl && (
                      <IconButton edge="end" aria-label="view image" onClick={() => handleOpenImageDialog(item.imageUrl)}>
                        <ImageIcon sx={{ color: "#0A6847" }} />
                      </IconButton>
                    )}
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenUpdateDialog(item)}>
                      <EditIcon sx={{ color: "#F3CA52" }} />
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
        <Dialog open={imageDialogOpen} onClose={handleCloseImageDialog}>
          <DialogContent>
            <img
              src={selectedImageUrl}
              alt="Pantry Item"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  };

export default Pantry;
