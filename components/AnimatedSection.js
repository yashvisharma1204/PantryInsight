// components/AnimatedSection.js
import { Box, Typography, Button } from "@mui/material";

const AnimatedSection = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      textAlign: "center",
      backgroundColor: "#F0F4F8",
      padding: 3,
      '& h2': {
        animation: 'fadeIn 2s ease-in-out'
      },
      '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 }
      }
    }}
  >
    <Typography 
      variant="h2" 
      gutterBottom 
      sx={{ 
        color: "#6C946F", 
        fontWeight: 600 
      }}
    >
      Welcome to PantryInsight
    </Typography>
    <Typography 
      variant="h5" 
      gutterBottom 
      sx={{ 
        color: "#FFA823" 
      }}
    >
      Organize Your Pantry Effortlessly
    </Typography>
    <Box sx={{ display: 'flex', gap: 2 }}>
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
          '&:hover': {
            backgroundColor: "#DC0083", 
            color: "#fff"
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
