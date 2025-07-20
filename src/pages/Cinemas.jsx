// src/pages/Cinemas.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DataTable from '../components/DataTable';
import EntityForm from '../components/EntityForm';
import { adminApi } from '../services/api';
import './Cinemas.css';

const Cinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [currentCinema, setCurrentCinema] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getCinemas();
      setCinemas(response.data);
    } catch (error) {
      console.error('Error fetching cinemas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentCinema({
      name: '',
      location: '',
      screens: 0,
    });
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEdit = (cinema) => {
    setCurrentCinema(cinema);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteCinema(id);
      fetchCinemas();
    } catch (error) {
      console.error('Error deleting cinema:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await adminApi.updateCinema(currentCinema._id, currentCinema);
      } else {
        await adminApi.createCinema(currentCinema);
      }
      fetchCinemas();
      setOpenForm(false);
    } catch (error) {
      console.error('Error saving cinema:', error);
    }
  };

  const columns = [
    { id: 'name', label: 'Nom', minWidth: 150 },
    { id: 'location', label: 'Emplacement', minWidth: 200 },
    { id: 'screens', label: 'Salles', minWidth: 100 },
    { id: 'createdAt', label: 'Date de création', minWidth: 150 },
  ];

  const formFields = [
    { name: 'name', label: 'Nom du cinéma' },
    { name: 'location', label: 'Emplacement' },
    { name: 'screens', label: 'Nombre de salles', type: 'number' },
  ];

  return (
    <Box className="cinemas-admin-page">
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }} className="cinemas-admin-title">
        Gestion des Cinémas
      </Typography>
      
      <div className="advanced-card">
        <DataTable
          data={cinemas}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          isLoading={isLoading}
          title="Liste des Cinémas"
          className="advanced-table"
        />
      </div>
      
      {/* Render EntityForm only if openForm is true and currentCinema is valid */}
      {openForm && currentCinema && (
        <div className="advanced-form">
          <EntityForm
            open={openForm}
            handleClose={() => setOpenForm(false)}
            entity={currentCinema}
            setEntity={setCurrentCinema}
            fields={formFields}
            title="Cinéma"
            onSubmit={handleSubmit}
            isEditing={isEditing}
          />
        </div>
      )}
    </Box>
  );
};

export default Cinemas;