// src/pages/Tickets.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DataTable from '../components/DataTable';
import { adminApi } from '../services/api';
import './Tickets.css';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { id: 'code', label: 'Code', minWidth: 100 },
    { 
      id: 'session', 
      label: 'Séance', 
      minWidth: 200, 
      format: (value) => 
        value ? `${value.film?.title || 'Film inconnu'} - ${value.date}` : 'N/A'  // Null-safe access
    },
    { 
      id: 'user', 
      label: 'Utilisateur', 
      minWidth: 150, 
      format: (value) => value?.name || 'N/A'  // Null-safe access
    },
    { id: 'price', label: 'Prix (€)', minWidth: 100 },
    { id: 'status', label: 'Statut', minWidth: 100 },
    { id: 'createdAt', label: 'Date d\'achat', minWidth: 150 },
  ];

  return (
    <Box className="tickets-admin-page">
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }} className="tickets-admin-title">
        Gestion des Tickets
      </Typography>
      
      <div className="advanced-card">
        <DataTable
          data={tickets}
          columns={columns}
          isLoading={isLoading}
          title="Liste des Tickets"
          className="advanced-table"
        />
      </div>
    </Box>
  );
};

export default Tickets;