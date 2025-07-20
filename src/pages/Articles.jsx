import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DataTable from '../components/DataTable';
import EntityForm from '../components/EntityForm';
import { adminApi } from '../services/api';
import './Articles.css';

// Move columns and formFields here
const columns = [
  { id: 'title', label: 'Titre', minWidth: 200 },
  { id: 'author', label: 'Auteur', minWidth: 150, format: (value) => value?.name || '' },
  { id: 'category', label: 'Catégorie', minWidth: 100 },
  { id: 'createdAt', label: 'Date de création', minWidth: 150 },
];

const formFields = [
  { name: 'title', label: 'Titre' },
  { 
    name: 'category', 
    label: 'Catégorie',
    type: 'select',
    options: [
      { value: 'news', label: 'Actualités' },
      { value: 'review', label: 'Critiques' },
      { value: 'interview', label: 'Interviews' },
    ]
  },
  { name: 'content', label: 'Contenu', multiline: true, rows: 6 },
];

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getArticles();
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeForm = () => {
    setOpenForm(false);
    setCurrentArticle(null);
  };

  const handleCreate = () => {
    setCurrentArticle({
      title: '',
      content: '',
      author: '',
      category: '',
    });
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEdit = (article) => {
    setCurrentArticle(article);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteArticle(id);
      if (currentArticle?._id === id) {
        closeForm();
      }
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await adminApi.updateArticle(currentArticle._id, currentArticle);
      } else {
        await adminApi.createArticle(currentArticle);
      }
      fetchArticles();
      closeForm();
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  return (
    <Box className="articles-admin-page">
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }} className="articles-admin-title">
        Gestion des Articles
      </Typography>
      
      <div className="advanced-card">
        <DataTable
          data={articles}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          isLoading={isLoading}
          title="Liste des Articles"
          className="advanced-table"
        />
      </div>
      
      {/* Render EntityForm only if openForm is true and currentArticle is valid */}
      {openForm && currentArticle && (
        <div className="advanced-form">
          <EntityForm
            open={openForm}
            handleClose={closeForm}
            entity={currentArticle}
            setEntity={setCurrentArticle}
            fields={formFields}
            title="Article"
            onSubmit={handleSubmit}
            isEditing={isEditing}
          />
        </div>
      )}
    </Box>
  );
};

export default Articles;