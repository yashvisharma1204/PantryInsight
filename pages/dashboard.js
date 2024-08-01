import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid, useMediaQuery } from "@mui/material";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Navbar from '../components/Navbar'; // Import the Navbar component

// Register the components you are using
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Function to create chart data for bar graphs
const createBarChartData = (data, type) => {
  return {
    labels: Object.keys(data),
    datasets: [
      {
        label: type === 'total' ? 'Total Items' : 'Expired Items',
        data: Object.values(data).map(category => type === 'total' ? category.totalItems : category.expiredItems),
        backgroundColor: type === 'total' ? '#0A6847' : '#DC0083',
      },
    ],
  };
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `Value: ${tooltipItem.raw}`;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Categories',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Values',
      },
      min: 0,  // Ensure the y-axis starts at 0
    },
  },
};

export default function Dashboard() {
  const [categoryData, setCategoryData] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [expiredItems, setExpiredItems] = useState(0);
  
  // Determine if the screen size is less than 600px
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchData = async (user) => {
      try {
        const q = query(collection(db, "pantryItems"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        // Calculate metrics
        const data = {};
        let totalItemCount = 0;
        let expiredItemCount = 0;
        const today = new Date();

        items.forEach(item => {
          if (!data[item.category]) {
            data[item.category] = { totalItems: 0, expiredItems: 0 };
          }
          data[item.category].totalItems += 1;
          totalItemCount += 1;
          if (new Date(item.expirationDate) < today) {
            data[item.category].expiredItems += 1;
            expiredItemCount += 1;
          }
        });

        setCategoryData(data);
        setTotalItems(totalItemCount);
        setExpiredItems(expiredItemCount);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchData(user);
      } else {
        setCategoryData({});
        setTotalItems(0);
        setExpiredItems(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar /> {/* Include the Navbar */}
      <Box
        sx={{
          paddingTop: "60px", // Adjust for the fixed navbar
          backgroundColor: '#000', // Light Yellow background
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isSmallScreen ? 2 : 3, // Adjust padding for small screens
        }}
      >
        <Typography variant={isSmallScreen ? "h5" : "h4"} gutterBottom sx={{ color: "#0A6847" }}>
          Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ marginBottom: 3, justifyContent: 'center' }}>
          <Grid item xs={12} sm={6}>
            <Paper
              sx={{
                padding: isSmallScreen ? 2 : 3, // Adjust padding for small screens
                backgroundColor: '#212121',
                borderRadius: 1,
                boxShadow: 3,
                textAlign: 'center',
                marginTop: isSmallScreen? 3 : 'none',
              }}
            >
              <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{ color: "#0A6847" }}>
                Total Number of Products
              </Typography>
              <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ color: "#6C946F" }}>
                {totalItems}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              sx={{
                padding: isSmallScreen ? 2 : 3, // Adjust padding for small screens
                backgroundColor: '#212121',
                borderRadius: 1,
                boxShadow: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{ color: "#0A6847" }}>
                Total Expired Products
              </Typography>
              <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ color: "#DC0083" }}>
                {expiredItems}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          {Object.keys(categoryData).map((category) => (
            <Grid item xs={12} sm={4} key={category}>
              <Paper
                sx={{
                  padding: isSmallScreen ? 2 : 3, // Adjust padding for small screens
                  backgroundColor: '#212121',
                  borderRadius: 1,
                  boxShadow: 3,
                  textAlign: 'center',
                }}
              >
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{ color: "#0A6847" }}>
                  {category}
                </Typography>
                <Typography variant={isSmallScreen ? "body2" : "h6"} gutterBottom sx={{ color: "#6C946F" }}>
                  Total Items: {categoryData[category].totalItems}
                </Typography>
                <Typography variant={isSmallScreen ? "body2" : "h6"} gutterBottom sx={{ color: "#DC0083" }}>
                  Expired Items: {categoryData[category].expiredItems}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          sx={{
            padding: isSmallScreen ? 2 : 3, // Adjust padding for small screens
            backgroundColor: '#212121',
            borderRadius: 1,
            boxShadow: 3,
            marginBottom: 3,
            maxHeight: isSmallScreen?'50vh':'800px',
            width: isSmallScreen?'80vw':'100%',
          }}
        >
          <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{ color: "#0A6847" }}>
            Total Items by Category
          </Typography>
          <Bar data={createBarChartData(categoryData, 'total')} options={chartOptions} height={200} />
        </Paper>

        <Paper
          sx={{
            padding: isSmallScreen ? 2 : 3, // Adjust padding for small screens
            maxHeight: isSmallScreen?'50vh':'800px',
            width: isSmallScreen?'80vw':'100%',
            backgroundColor: '#212121',
            borderRadius: 1,
            boxShadow: 3,
            fontSize:'2'
          }}
        >
          <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{ color: "#0A6847" }}>
            Expired Items by Category
          </Typography>
          <Bar data={createBarChartData(categoryData, 'expired')} options={chartOptions} height={200} />
        </Paper>
        <br></br>
      </Box>
    </>
  );
}
