// src/components/Search.js

import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <TextField
      label=""
      variant="outlined"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      fullWidth
      sx={{ 
        maxWidth: 500, 
        margin:3,
        borderRadius:20,// Set the maximum width to 100px
        backgroundColor: 'darkgrey', // Set the background color to white
        '& .MuiOutlinedInput-root': {
          borderRadius: '23px', // Optional: round the corners of the text field
        },
        '@media (max-width: 600px)':{
            maxWidth:200,
            marginTop:10
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default Search;
