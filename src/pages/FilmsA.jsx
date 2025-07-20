// src/pages/Films.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DataTable from '../components/DataTable';
import EntityForm from '../components/EntityForm';
import { adminApi } from '../services/api';
import './FilmsA.css';

const FilmsA = () => {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [currentFilm, setCurrentFilm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getFilms();
      setFilms(response.data);
    } catch (error) {
      console.error('Error fetching films:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentFilm({
      title: '',
      director: '',
      duration: 0,
      genre: '',
      synopsis: '',
    });
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEdit = (film) => {
    setCurrentFilm(film);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteFilm(id);
      fetchFilms();
    } catch (error) {
      console.error('Error deleting film:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await adminApi.updateFilm(currentFilm._id, currentFilm);
      } else {
        await adminApi.createFilm(currentFilm);
      }
      fetchFilms();
      setOpenForm(false);
    } catch (error) {
      console.error('Error saving film:', error);
    }
  };

  const columns = [
    { id: 'title', label: 'Titre', minWidth: 150 },
    { id: 'director', label: 'Réalisateur', minWidth: 150 },
    { id: 'duration', label: 'Durée (min)', minWidth: 100 },
    { id: 'genre', label: 'Genre', minWidth: 100 },
    { id: 'releaseDate', label: 'Date de sortie', minWidth: 120 },
  ];

  const formFields = [
    { name: 'title', label: 'Titre' },
    { name: 'director', label: 'Réalisateur' },
    { name: 'duration', label: 'Durée (minutes)', type: 'number' },
    { 
      name: 'genre', 
      label: 'Genre',
      type: 'select',
      options: [
        { value: 'action', label: 'Action' },
        { value: 'drama', label: 'Drame' },
        { value: 'comedy', label: 'Comédie' },
        { value: 'horror', label: 'Horreur' },
        { value: 'sci-fi', label: 'Science-Fiction' },
      ]
    },
    { name: 'synopsis', label: 'Synopsis', multiline: true, rows: 4 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gestion des Films
      </Typography>
      
      <DataTable
        data={films}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
        title="Liste des Films"
      />
      
      {/* Render EntityForm only if openForm is true and currentFilm is valid */}
      {openForm && currentFilm && (
        <EntityForm
          open={openForm}
          handleClose={() => setOpenForm(false)}
          entity={currentFilm}
          setEntity={setCurrentFilm}
          fields={formFields}
          title="Film"
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
      )}
    </Box>
  );
};

export default FilmsA;