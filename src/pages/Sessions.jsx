// src/pages/Sessions.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DataTable from '../components/DataTable';
import EntityForm from '../components/EntityForm';
import { adminApi } from '../services/api';
import './Sessions.css';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [sessionsRes, filmsRes, cinemasRes] = await Promise.all([
        adminApi.getSessions(),
        adminApi.getFilms(),
        adminApi.getCinemas(),
      ]);
      setSessions(sessionsRes.data);
      setFilms(filmsRes.data);
      setCinemas(cinemasRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentSession({
      film: '',
      cinema: '',
      screen: '',
      date: '',
      time: '',
      seatsAvailable: 0,
    });
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEdit = (session) => {
    setCurrentSession(session);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteSession(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await adminApi.updateSession(currentSession._id, currentSession);
      } else {
        await adminApi.createSession(currentSession);
      }
      fetchData();
      setOpenForm(false);
    } catch (error) {
      console.error('Error saving session:', error);
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
      id: 'cinema', 
      label: 'Cinéma', 
      minWidth: 150, 
      format: (value) => value?.name || 'N/A'  // Null-safe access
    },
    { id: 'screen', label: 'Salle', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 120 },
    { id: 'time', label: 'Heure', minWidth: 100 },
    { id: 'seatsAvailable', label: 'Places disponibles', minWidth: 120 },
  ];

  const formFields = [
    {
      name: 'film',
      label: 'Film',
      type: 'select',
      options: films.map(film => ({ value: film._id, label: film.title }))
    },
    {
      name: 'cinema',
      label: 'Cinéma',
      type: 'select',
      options: cinemas.map(cinema => ({ value: cinema._id, label: cinema.name }))
    },
    { name: 'screen', label: 'Salle' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'time', label: 'Heure', type: 'time' },
    { name: 'seatsAvailable', label: 'Places disponibles', type: 'number' },
  ];

  return (
    <Box className="sessions-admin-page">
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }} className="sessions-admin-title">
        Gestion des Séances
      </Typography>
      
      <Box className="advanced-card">
        <DataTable
          data={sessions}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          isLoading={isLoading}
          title="Liste des Séances"
          className="advanced-table"
        />
      </Box>
      
      {/* Render EntityForm only if openForm is true and currentSession is valid */}
      {openForm && currentSession && (
        <Box className="advanced-form">
          <EntityForm
            open={openForm}
            handleClose={() => setOpenForm(false)}
            entity={currentSession}
            setEntity={setCurrentSession}
            fields={formFields}
            title="Séance"
            onSubmit={handleSubmit}
            isEditing={isEditing}
          />
        </Box>
      )}
    </Box>
  );
};

export default Sessions;