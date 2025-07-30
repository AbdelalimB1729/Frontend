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
    { 
      id: '_id', 
      label: 'ID', 
      minWidth: 100,
      format: (value) => value.substring(0, 6) // Affiche les 6 premiers caractères de l'ID
    },
    { 
      id: 'session', 
      label: 'Séance', 
      minWidth: 200, 
      format: (value) => {
        if (!value) return 'N/A';
        const date = new Date(value.date);
        return `${value.film?.title || 'Film inconnu'} - ${date.toLocaleDateString()}`;
      }
    },
    { 
      id: 'user', 
      label: 'Utilisateur', 
      minWidth: 150, 
      format: (value) => value?.name || 'N/A'
    },
    { 
      id: 'seatNumber', 
      label: 'Siège', 
      minWidth: 100 
    },
    { 
      id: 'paid', 
      label: 'Statut', 
      minWidth: 100,
      format: (value) => value ? 'Payé' : 'Non payé'
    },
    { 
      id: 'paymentMethod', 
      label: 'Méthode de paiement', 
      minWidth: 120 
    },
    { 
      id: 'createdAt', 
      label: 'Date d\'achat', 
      minWidth: 150,
      format: (value) => new Date(value).toLocaleDateString()
    },
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