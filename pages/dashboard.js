import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Navbar from '../components/Navbar'; // Import the Navbar component

// Register the components you are using
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Function to create chart data
const createChartData = (totalItems, expiredItems) => {
  return {
    labels: ['Total Items', 'Expired Items'],
    datasets: [
      {
        label: 'Pantry Items Data',
        data: [totalItems, expiredItems],
        fill: false,
        borderColor: '#0A6847',
        tension: 0.1,
      },
    ],
  };
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(tooltipItem) {
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
  const [pantryItems, setPantryItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [expiredItems, setExpiredItems] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    const fetchData = async (user) => {
      try {
        const q = query(collection(db, "pantryItems"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        // Calculate metrics
        const categories = new Set();
        let expiredCount = 0;
        const today = new Date();

        items.forEach(item => {
          categories.add(item.category); // Assuming there's a category field
          if (new Date(item.expirationDate) < today) {
            expiredCount++;
          }
        });

        setPantryItems(items);
        setTotalItems(items.length);
        setExpiredItems(expiredCount);
        setTotalCategories(categories.size);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchData(user);
      } else {
        setPantryItems([]);
        setTotalItems(0);
        setExpiredItems(0);
        setTotalCategories(0);
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
          backgroundColor: '#F6E9B2', // Light Yellow background
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#0A6847" }}>
          Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 1,
                boxShadow: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#0A6847" }}>
                Total Items
              </Typography>
              <Typography variant="h4" sx={{ color: "#6C946F" }}>
                {totalItems}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 1,
                boxShadow: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#0A6847" }}>
                Expired Items
              </Typography>
              <Typography variant="h4" sx={{ color: "#DC0083" }}>
                {expiredItems}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 1,
                boxShadow: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#0A6847" }}>
                Total Categories
              </Typography>
              <Typography variant="h4" sx={{ color: "#7ABA78" }}>
                {totalCategories}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper
          sx={{
            padding: 3,
            maxWidth: '800px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <Line data={createChartData(totalItems, expiredItems)} options={chartOptions} />
        </Paper>

        <Box
          sx={{
            marginTop: 'auto', // Pushes footer to the bottom
            backgroundColor: '#0A6847', // Footer background color
            color: '#F6E9B2', // Footer text color
            padding: 2,
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
