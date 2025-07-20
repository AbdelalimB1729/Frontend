// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, CircularProgress } from '@mui/material';
import { 
  People as UsersIcon, 
  Movie as FilmsIcon, 
  Theaters as CinemasIcon, 
  EventSeat as TicketsIcon, 
  Schedule as SessionsIcon,
  RateReview as RatingsIcon,
  Article as ArticlesIcon
} from '@mui/icons-material';
import StatsCard from '../components/StatsCard';
import { adminApi } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    films: 0,
    cinemas: 0,
    sessions: 0,
    tickets: 0,
    articles: 0,
    ratings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [
          usersRes, 
          filmsRes, 
          cinemasRes, 
          sessionsRes, 
          ticketsRes, 
          articlesRes, 
          ratingsRes
        ] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getFilms(),
          adminApi.getCinemas(),
          adminApi.getSessions(),
          adminApi.getTickets(),
          adminApi.getArticles(),
          adminApi.getRatings(),
        ]);
        
        setStats({
          users: usersRes.data.length,
          films: filmsRes.data.length,
          cinemas: cinemasRes.data.length,
          sessions: sessionsRes.data.length,
          tickets: ticketsRes.data.length,
          articles: articlesRes.data.length,
          ratings: ratingsRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Tableau de Bord
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard 
              title="Utilisateurs" 
              value={stats.users} 
              icon={<UsersIcon fontSize="large" />}
              color="#3f51b5"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard 
              title="Films" 
              value={stats.films} 
              icon={<FilmsIcon fontSize="large" />}
              color="#f44336"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard 
              title="Cinémas" 
              value={stats.cinemas} 
              icon={<CinemasIcon fontSize="large" />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard 
              title="Séances" 
              value={stats.sessions} 
              icon={<SessionsIcon fontSize="large" />}
              color="#ff9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard 
              title="Tickets" 
              value={stats.tickets} 
              icon={<TicketsIcon fontSize="large" />}
              color="#9c27b0"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard 
              title="Articles" 
              value={stats.articles} 
              icon={<ArticlesIcon fontSize="large" />}
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard 
              title="Notes" 
              value={stats.ratings} 
              icon={<RatingsIcon fontSize="large" />}
              color="#607d8b"
            />
          </Grid>
          
          {/* Dernières activités */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Derniers Utilisateurs
              </Typography>
              {/* Liste des derniers utilisateurs */}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Dernières Séances
              </Typography>
              {/* Liste des dernières séances */}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;