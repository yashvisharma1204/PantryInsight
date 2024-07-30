// components/BentoBox.js
import { Box, Typography } from "@mui/material";

const BentoBox = ({ title, children }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: 600,
      padding: 3,
      backgroundColor: "black",
      borderRadius: 1,
      boxShadow: 3,
      marginBottom: 3,
      textAlign: "left",
      '&:hover': {
        transform: 'scale(1.02)',
        transition: 'transform 0.3s ease-in-out'
      }
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ color: "#6C946F", fontWeight: 600 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

export default BentoBox;
