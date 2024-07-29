// components/Navbar.js
import { Box, Typography, Button } from "@mui/material";
import { Link } from "next/link";

const Navbar = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 2,
      backgroundColor: "#fff",
      boxShadow: 2,
      position: "fixed",
      width: "100%",
      top: 0,
      left: 0,
    }}
  >
    <Typography variant="h6" sx={{ color: "#6C946F" }}>
      PantryCheck
    </Typography>
    <Box>
      <Button component={Link} href="/" sx={{ marginRight: 2 }}>
        Home
      </Button>
      <Button component={Link} href="/dashboard" sx={{ marginRight: 2 }}>
        Dashboard
      </Button>
      <Button component={Link} href="/pantry">
        Pantry
      </Button>
    </Box>
  </Box>
);

export default Navbar;
