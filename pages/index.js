// pages/index.js
import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import AnimatedSection from "../components/AnimatedSection"; // Ensure this path is correct

export default function Home() {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          paddingTop: "60px", // Adjust for the fixed navbar
          backgroundColor: '#121212', // Light Yellow background
          minHeight: 'calc(100vh - 80px)', // Ensure footer is at bottom
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AnimatedSection />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row', // Align items horizontally
            justifyContent: 'space-between', // Space items left and right
            alignItems: 'stretch', // Stretch items to be the same height
            gap: 3, // Space between the BentoBoxes
            padding: 3,
            flexWrap: 'wrap',
            maxWidth: '1200px', // Adjust as needed
            margin: '0 auto', // Center the content
            '@media (max-width: 600px)': {
              flexDirection: 'column', // Stack items vertically on small screens
              padding: 1,
              gap: 2,
            }
          }}
        >
          <Box
            sx={{
              flex: 1,
              maxWidth: '48%', // Adjust max width as needed
              minWidth: '300px', // Ensure boxes are not too narrow
              backgroundColor: 'black', // White background for the box
              borderRadius: 1,
              boxShadow: 3,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#f3f3f3',
              '@media (max-width: 600px)': {
                maxWidth: '100%', // Full width on small screens
                marginBottom: 2, // Space between stacked boxes
              }
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: "#0A6847" }}>
              About Pantry<b>Insight</b>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Pantry<b>Insight</b> is your ultimate solution for managing pantry items. Easily add, view, and remove items, and track expiration dates to keep your pantry organized and efficient.
            </Typography>
            <Typography variant="body1">
              Our intuitive interface helps you manage your kitchen supplies effortlessly, ensuring you never run out of essential items.
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              maxWidth: '48%', // Adjust max width as needed
              minWidth: '300px', // Ensure boxes are not too narrow
              backgroundColor: 'black', // White background for the box
              borderRadius: 1,
              boxShadow: 3,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#f3f3f3',
              '@media (max-width: 600px)': {
                maxWidth: '100%', // Full width on small screens
                marginBottom: 2, // Space between stacked boxes
              }
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: "#0A6847" }}>
              Features
            </Typography>
            <Typography variant="body1" gutterBottom>
              1. Add new items to your pantry with details such as quantity and expiration date.
            </Typography>
            <Typography variant="body1">
              2. View and manage your pantry items with a user-friendly interface.
            </Typography>
            <Typography variant="body1">
              3. Get reminders before items expire.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            marginTop: 'auto', // Pushes footer to the bottom
            backgroundColor: 'black', // Footer background color
            color: '#F6E9B2', // Footer text color
            padding: 2.4,
            textAlign: 'center',
            fontSize: '0.875rem', // Smaller font size
          }}
        >
          <Typography variant="body2">
            ©2024 All rights reserved.
          </Typography>
        </Box>
      </Box>
    </>
  );
}

