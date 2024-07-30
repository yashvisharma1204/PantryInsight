import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Box, TextField, Button, Typography } from "@mui/material";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const router = useRouter(); // Initialize useRouter for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error message before each submission
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/pantry"); // Redirect to pantry page upon successful login/register
    } catch (err) {
      console.error("Error: ", err.message);
      setError(err.message); // Display detailed error message
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        backgroundColor: '#000', // Background color
        padding: 3,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: '400px',
          padding: 3,
          backgroundColor: '#212121', // Form background color
          borderRadius: 1,
          boxShadow: 3,
          textAlign: 'left',
          color: "white"
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#6C946F" , '@media (max-width: 600px)': {
            fontSize:25,
            fontWeight:'bold'
          }}}>
          {isRegistering ? "Register" : "Login"}
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={{ mt: 2 ,'@media (max-width: 600px)': {
            fontSize:5,
            fontWeight:'bold'
          }}}
          InputLabelProps={{ sx: { color: 'white' }, '@media (max-width: 600px)': {
            fontSize:5,
            fontWeight:'bold',
          }}} // Change label color to white
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          sx={{ mt: 2 }}
          InputLabelProps={{ sx: 
            { color: 'white' },
            '@media (max-width: 600px)': {
            fontSize:5,
            fontWeight:'bold'
          }         
          }} // Change label color to white
        />
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ 
            width: '100%', 
            backgroundColor: "#FFD35A", // Button background color
            color: "#000", // Button text color
            '&:hover': {
              backgroundColor: "#FFA823", // Button hover color
            },
            mt: 2
          }}
        >
          {isRegistering ? "Register" : "Login"}
        </Button>
        <Button 
          onClick={() => setIsRegistering(!isRegistering)} 
          sx={{ 
            width: '100%', 
            color: "#DC0083", // Text color for alternate button
            borderColor: "#DC0083", // Border color for outlined button
            '&:hover': {
              backgroundColor: "#DC0083", // Button hover color
              color: "#fff" // Button text color on hover
            },
            mt: 2,
            '@media (max-width: 600px)': {
            fontSize:10,
          }
          }}
        >
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </Button>
      </Box>
    </Box>
  );
};

export default Auth;
