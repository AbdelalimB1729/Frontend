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
      date: new Date().toISOString().split('T')[0], // Date du jour par défaut
      time: '18:00', // Heure par défaut
      seats: [], // Initialiser avec un tableau vide
    });
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEdit = (session) => {
    setCurrentSession({
      ...session,
      date: session.date ? new Date(session.date).toISOString().split('T')[0] : '',
    });
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
      // Convertir la date en objet Date complet avec l'heure
      const dateTime = new Date(currentSession.date);
      const [hours, minutes] = currentSession.time.split(':');
      dateTime.setHours(parseInt(hours, 10));
      dateTime.setMinutes(parseInt(minutes, 10));
      
      const sessionData = {
        ...currentSession,
        date: dateTime,
      };

      if (isEditing) {
        await adminApi.updateSession(currentSession._id, sessionData);
      } else {
        await adminApi.createSession(sessionData);
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
      format: (value) => value?.title || 'N/A'
    },
    { 
      id: 'cinema', 
      label: 'Cinéma', 
      minWidth: 150, 
      format: (value) => value?.name || 'N/A'
    },
    { 
      id: 'date', 
      label: 'Date et Heure', 
      minWidth: 180,
      format: (value) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      }
    },
    { 
      id: 'seats', 
      label: 'Places réservées', 
      minWidth: 150,
      format: (seats) => {
        if (!seats) return '0/0';
        const total = seats.length;
        const reserved = seats.filter(seat => seat.isReserved).length;
        return `${reserved}/${total}`;
      }
    },
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
    { 
      name: 'date', 
      label: 'Date', 
      type: 'date',
      // Convertir pour l'input date (YYYY-MM-DD)
      getValue: (session) => session.date ? new Date(session.date).toISOString().split('T')[0] : ''
    },
    { 
      name: 'time', 
      label: 'Heure', 
      type: 'time',
      // Formater l'heure (HH:MM)
      getValue: (session) => {
        if (!session.date) return '18:00';
        const date = new Date(session.date);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
    },
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