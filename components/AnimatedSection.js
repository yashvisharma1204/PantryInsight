// components/AnimatedSection.js
import { Box, Typography, Button } from "@mui/material";
import Image from 'next/image';
import image from '../public/image 2.png'; // Ensure this path is correct

const imagesArray = [image, image]; // Create an array with three instances of the image

const AnimatedSection = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      textAlign: "center",
      backgroundColor: 'black',
      padding: 0,
      position: 'relative', // Add relative positioning for the container
      overflow: 'hidden', // Ensure the content stays within the container
      '& h2': {
        animation: 'fadeIn 2s ease-in-out'
      },
      '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 }
      },
      '@keyframes float': {
        '0%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-20px)' },
        '100%': { transform: 'translateY(0)' }
      }
    }}
  >
    <Box
      sx={{
        position: "absolute",
        left: 0, // Align to the left side
        top: 0,
        bottom: 0,
        width: '100%', // Ensure the box takes full width
        display: "flex",
        justifyContent: "space-around", // Distribute images evenly
        alignItems: "center",
        animation: "float 3s ease-in-out infinite",
        zIndex: 0 // Ensure the image is at the lowest z-index
      }}
    >
      {imagesArray.map((img, index) => (
        <Box key={index} sx={{ marginX: 1 }}>
          <Image
            src={img}
            alt={`Floating Image ${index + 1}`}
            width={700} // Adjust the size as needed
            height={700} // Adjust the size as needed
          />
        </Box>
      ))}
    </Box>
    <Typography 
      variant="h2" 
      gutterBottom 
      sx={{ 
        color: "#6C946F", 
        fontWeight: 600,
        zIndex: 1, // Higher z-index for text elements
        backgroundColor:'rgba(0,0,0,0.8)',
        padding:2,
        borderRadius:3,
      }}
    >
      PantryInsight
    </Typography>
    <Typography 
      variant="h5" 
      gutterBottom 
      sx={{ 
        color: "#FFA823",
        zIndex: 1, // Higher z-index for text elements
        backgroundColor:'rgba(0,0,0,0.8)',
        padding:2,
        borderRadius:3,
      }}
    >
      Organize Your Pantry Effortlessly
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, zIndex: 1 }}>
      <Button 
        variant="contained" 
        sx={{ 
          backgroundColor: "#FFD35A", 
          color: "#000", 
          '&:hover': {
            backgroundColor: "#FFA823"
          }
        }}
        href="/auth"
      >
        Sign Up
      </Button>
      <Button 
        variant="outlined" 
        sx={{ 
          color: "#DC0083", 
          borderColor: "#DC0083",
          backgroundColor: '#000' ,
          '&:hover': {
            backgroundColor: "#DC0083", 
            color: "#fff",
            border: 'none',
          }
        }}
        href="/auth"
      >
        Login
      </Button>
    </Box>
  </Box>
);

export default AnimatedSection;
