import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DataTable from '../components/DataTable';
import { adminApi } from '../services/api';

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getRatings();
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteRating(id);
      fetchRatings();
    } catch (error) {
      console.error('Error deleting rating:', error);
    }
  };

  const columns = [
    { 
      id: 'film', 
      label: 'Film', 
      minWidth: 150, 
      format: (value) => value?.title || 'N/A'  // Null-safe access
    },
    { 
      id: 'user', 
      label: 'Utilisateur', 
      minWidth: 150, 
      format: (value) => value?.name || 'N/A'  // Null-safe access
    },
    { id: 'rating', label: 'Note', minWidth: 100 },
    { id: 'comment', label: 'Commentaire', minWidth: 200 },
    { id: 'createdAt', label: 'Date', minWidth: 150 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gestion des Notes
      </Typography>
      
      <DataTable
        data={ratings}
        columns={columns}
        onDelete={handleDelete}
        isLoading={isLoading}
        title="Liste des Notes"
      />
    </Box>
  );
};

export default Ratings;