// src/components/EntityForm.jsx
import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, FormControl, InputLabel, Select, 
  MenuItem, Stack 
} from '@mui/material';

const EntityForm = ({ 
  open, 
  handleClose, 
  entity, 
  setEntity, 
  fields, 
  title,
  onSubmit,
  isEditing
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntity(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? `Modifier ${title}` : `Créer ${title}`}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {fields.map((field) => (
            field.type === 'select' ? (
              <FormControl key={field.name} fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={entity[field.name] || ''}
                  label={field.label}
                  onChange={handleChange}
                >
                  {field.options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type || 'text'}
                fullWidth
                variant="outlined"
                value={entity[field.name] || ''}
                onChange={handleChange}
                multiline={field.multiline}
                rows={field.rows}
              />
            )
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntityForm;