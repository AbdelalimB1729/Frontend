// src/pages/Users.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, FormControl, InputLabel, 
  Select, MenuItem, FormControlLabel, Switch, Snackbar, Alert 
} from '@mui/material';
import DataTable from '../components/DataTable';
import { adminApi } from '../services/api';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCreate = () => {
    setCurrentUser({
      name: '',
      email: '',
      password: '',
      role: 'user',
      isBlocked: false
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (user) => {
    setCurrentUser({
      ...user,
      password: '' // Réinitialiser le mot de passe pour ne pas afficher le hash
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleBlock = async (id, isBlocked) => {
    try {
      await adminApi.blockUser(id);
      showSnackbar(`Utilisateur ${isBlocked ? 'débloqué' : 'bloqué'} avec succès`);
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
      showSnackbar('Erreur lors de la modification du statut', 'error');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminApi.updateUserRole(id, role);
      showSnackbar('Rôle mis à jour avec succès');
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
      showSnackbar('Erreur lors de la mise à jour du rôle', 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      const userData = { ...currentUser };
      
      // Ne pas envoyer le mot de passe si vide pendant l'édition
      if (isEditing && userData.password === '') {
        delete userData.password;
      }

      if (isEditing) {
        await adminApi.updateUser(currentUser._id, userData);
        showSnackbar('Utilisateur mis à jour avec succès');
      } else {
        await adminApi.createUser(userData);
        showSnackbar('Utilisateur créé avec succès');
      }
      
      fetchUsers();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    }
  };

  const columns = [
    { id: 'name', label: 'Nom', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { 
      id: 'role', 
      label: 'Rôle', 
      minWidth: 100,
      format: (value) => value === 'admin' ? 'Admin' : 'Utilisateur'
    },
    { 
      id: 'isBlocked', 
      label: 'Statut', 
      minWidth: 100,
      format: (value) => value ? 'Bloqué' : 'Actif'
    },
    { 
      id: 'createdAt', 
      label: 'Date de création', 
      minWidth: 150,
      format: (value) => new Date(value).toLocaleDateString()
    },
  ];

  return (
    <Box className="users-admin-page">
      <Typography className="users-admin-title" variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gestion des Utilisateurs
      </Typography>
      
      <Box className="advanced-card">
        <DataTable
          data={users}
          columns={columns}
          onEdit={handleEdit}
          onBlock={handleBlock}
          onRoleChange={handleRoleChange}
          onCreate={handleCreate}
          isLoading={isLoading}
          title="Liste des Utilisateurs"
          className="advanced-table"
          // Ne pas passer la fonction de suppression
        />
      </Box>
      
      {/* Formulaire d'édition/création */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {isEditing ? 'Modifier Utilisateur' : 'Créer Nouvel Utilisateur'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nom complet"
            fullWidth
            variant="outlined"
            value={currentUser?.name || ''}
            onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={currentUser?.email || ''}
            onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            label={isEditing ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
            type="password"
            fullWidth
            variant="outlined"
            value={currentUser?.password || ''}
            onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
            sx={{ mb: 2 }}
            required={!isEditing}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rôle *</InputLabel>
            <Select
              value={currentUser?.role || 'user'}
              label="Rôle"
              onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
              required
            >
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Administrateur</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={currentUser?.isBlocked || false}
                onChange={(e) => setCurrentUser({...currentUser, isBlocked: e.target.checked})}
              />
            }
            label="Bloquer l'utilisateur"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({...snackbar, open: false})}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;