// src/pages/FilmsA.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
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
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApi.getFilms();
      setFilms(response.data);
    } catch (error) {
      console.error('Error fetching films:', error);
      setError('Échec du chargement des films');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentFilm({
      title: '',
      director: '',
      duration: 90,  // Valeur par défaut plus logique
      genre: [],
      year: new Date().getFullYear(),
      description: '',
      poster: ''
    });
    setIsEditing(false);
    setOpenForm(true);
    setError(null);
  };

  const handleEdit = (film) => {
    setCurrentFilm({
      ...film,
      // S'assurer que genre est toujours un tableau
      genre: Array.isArray(film.genre) ? film.genre : [film.genre]
    });
    setIsEditing(true);
    setOpenForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await adminApi.deleteFilm(id);
      fetchFilms();
    } catch (error) {
      console.error('Error deleting film:', error);
      setError('Échec de la suppression du film');
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      
      // Normalisation des données
      const filmData = {
        ...currentFilm,
        // Garantir que genre est un tableau
        genre: Array.isArray(currentFilm.genre) 
          ? currentFilm.genre 
          : [currentFilm.genre].filter(Boolean),
        // Conversion en nombres
        year: Number(currentFilm.year),
        duration: Number(currentFilm.duration)
      };

      if (isEditing) {
        await adminApi.updateFilm(currentFilm._id, filmData);
      } else {
        await adminApi.createFilm(filmData);
      }
      
      fetchFilms();
      setOpenForm(false);
    } catch (error) {
      console.error('Error saving film:', error);
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const columns = [
    { id: 'title', label: 'Titre', minWidth: 150 },
    { id: 'director', label: 'Réalisateur', minWidth: 150 },
    { id: 'duration', label: 'Durée (min)', minWidth: 100 },
    { 
      id: 'genre', 
      label: 'Genre', 
      minWidth: 150,
      format: (value) => Array.isArray(value) ? value.join(', ') : value
    },
    { id: 'year', label: 'Année', minWidth: 100 },
  ];

  const formFields = [
    { 
      name: 'title', 
      label: 'Titre', 
      required: true,
      fullWidth: true
    },
    { 
      name: 'director', 
      label: 'Réalisateur',
      fullWidth: true
    },
    { 
      name: 'duration', 
      label: 'Durée (minutes)', 
      type: 'number',
      inputProps: { min: 1, step: 1 },
      fullWidth: true
    },
    { 
      name: 'year', 
      label: 'Année de sortie', 
      type: 'number',
      inputProps: { 
        min: 1900, 
        max: new Date().getFullYear() 
      },
      fullWidth: true
    },
    { 
      name: 'genre', 
      label: 'Genre',
      type: 'select',
      multiple: true,
      options: [
        { value: 'action', label: 'Action' },
        { value: 'drama', label: 'Drame' },
        { value: 'comedy', label: 'Comédie' },
        { value: 'horror', label: 'Horreur' },
        { value: 'sci-fi', label: 'Science-Fiction' },
        { value: 'fantasy', label: 'Fantasy' },
        { value: 'romance', label: 'Romance' },
        { value: 'thriller', label: 'Thriller' },
        { value: 'animation', label: 'Animation' },
      ],
      fullWidth: true
    },
    { 
      name: 'description', 
      label: 'Description', 
      multiline: true, 
      rows: 4,
      fullWidth: true
    },
    { 
      name: 'poster', 
      label: 'URL de l\'affiche',
      fullWidth: true
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gestion des Films
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <DataTable
        data={films}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
        title="Liste des Films"
      />
      
      {openForm && currentFilm && (
        <EntityForm
          open={openForm}
          handleClose={() => setOpenForm(false)}
          entity={currentFilm}
          setEntity={setCurrentFilm}
          fields={formFields}
          title={isEditing ? "Modifier le Film" : "Créer un Nouveau Film"}
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
      )}
    </Box>
  );
};

export default FilmsA;