// src/pages/Ratings.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DataTable from '../components/DataTable';
import { adminApi } from '../services/api';
import './Ratings.css';

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
      id: 'resource',
      label: 'Élément noté', 
      minWidth: 200, 
      format: (_, row) => {
        if (row.film) {
          return `Film: ${row.film?.title || 'Film '}`;
        } else if (row.article) {
          return `Article: ${row.article?.title || 'Article '}`;
        }
        return 'N/A';
      }
    },
    { 
      id: 'user', 
      label: 'Utilisateur', 
      minWidth: 150, 
      format: (value) => value?.name || 'N/A'
    },
    { 
      id: 'stars', 
      label: 'Note', 
      minWidth: 100,
      format: (value) => `${value}/5`
    },
    { id: 'comment', label: 'Commentaire', minWidth: 200 },
    { 
      id: 'createdAt', 
      label: 'Date', 
      minWidth: 150,
      format: (value) => new Date(value).toLocaleDateString()
    },
  ];

  return (
    <Box className="ratings-admin-page">
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }} className="ratings-admin-title">
        Gestion des Notes
      </Typography>
      
      <div className="advanced-card">
        <DataTable
          data={ratings}
          columns={columns}
          onDelete={handleDelete}
          isLoading={isLoading}
          title="Liste des Notes"
          className="advanced-table"
        />
      </div>
    </Box>
  );
};

export default Ratings;