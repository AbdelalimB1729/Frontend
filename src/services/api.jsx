// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fonctions pour chaque entité
export const adminApi = {
  // Utilisateurs
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  blockUser: (id) => api.put(`/users/block/${id}`),
  updateUserRole: (id, role) => api.patch(`/users/role/${id}?role=${role}`),
  
  // Films
  getFilms: () => api.get('/films'),
  createFilm: (filmData) => api.post('/films', filmData),
  updateFilm: (id, filmData) => api.put(`/films/${id}`, filmData),
  deleteFilm: (id) => api.delete(`/films/${id}`),
  getFilmsByGenre: (genre) => api.get(`/films/genre/${genre}`),
  
  // Cinémas
  getCinemas: () => api.get('/cinemas'),
  createCinema: (cinemaData) => api.post('/cinemas', cinemaData),
  updateCinema: (id, cinemaData) => api.put(`/cinemas/${id}`, cinemaData),
  deleteCinema: (id) => api.delete(`/cinemas/${id}`),
  
  // Séances
  getSessions: () => api.get('/sessions'),
  createSession: (sessionData) => api.post('/sessions', sessionData),
  updateSession: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
  
  // Tickets
  getTickets: () => api.get('/tickets'),
  createTicket: (ticketData) => api.post('/tickets', ticketData),
  updateTicket: (id, ticketData) => api.put(`/tickets/${id}`, ticketData),
  deleteTicket: (id) => api.delete(`/tickets/${id}`),
  
  // Articles
  getArticles: () => api.get('/blog'),
  createArticle: (articleData) => api.post('/blog', articleData),
  updateArticle: (id, articleData) => api.put(`/blog/${id}`, articleData),
  deleteArticle: (id) => api.delete(`/blog/${id}`),
  
  // Notes
  getRatings: () => api.get('/ratings'),
  createRating: (ratingData) => api.post('/ratings', ratingData),
  updateRating: (id, ratingData) => api.put(`/ratings/${id}`, ratingData),
  deleteRating: (id) => api.delete(`/ratings/${id}`),
};

export default api;