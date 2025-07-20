// src/pages/Users.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DataTable from '../components/DataTable';
import { adminApi } from '../services/api';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    } finally {
      setIsLoading(false);
    }
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
    setCurrentUser(user);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleBlock = async (id, isBlocked) => {
    try {
      await adminApi.blockUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminApi.updateUserRole(id, role);
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await adminApi.updateUser(currentUser._id, currentUser);
      } else {
        await adminApi.createUser(currentUser);
      }
      fetchUsers();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving user:', error);
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
    { id: 'createdAt', label: 'Date de création', minWidth: 150 },
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
          onDelete={handleDelete}
          onBlock={handleBlock}
          onRoleChange={handleRoleChange}
          onCreate={handleCreate}
          isLoading={isLoading}
          title="Liste des Utilisateurs"
          className="advanced-table"
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
            label="Nom"
            fullWidth
            variant="outlined"
            value={currentUser?.name || ''}
            onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={currentUser?.email || ''}
            onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          {!isEditing && (
            <TextField
              margin="dense"
              label="Mot de passe"
              type="password"
              fullWidth
              variant="outlined"
              value={currentUser?.password || ''}
              onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
              sx={{ mb: 2 }}
            />
          )}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rôle</InputLabel>
            <Select
              value={currentUser?.role || 'user'}
              label="Rôle"
              onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
            >
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Administrateur</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;