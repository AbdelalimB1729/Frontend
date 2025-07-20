// src/components/DataTable.jsx
import React, { useState } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, IconButton, 
  Tooltip, Box, TextField, Button, Menu, MenuItem, 
  Typography, CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Block as BlockIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

const DataTable = ({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onBlock, 
  onRoleChange,
  onCreate,
  isLoading,
  title
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState('all');
  const open = Boolean(anchorEl);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (column) => {
    setFilterColumn(column);
    setAnchorEl(null);
  };

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    
    if (filterColumn === 'all') {
      return Object.values(item).some(
        value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return item[filterColumn] && 
           item[filterColumn].toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Button variant="contained" color="primary" onClick={onCreate}>
          Créer
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Tooltip title="Filtrer">
          <IconButton onClick={handleFilterClick}>
            <FilterIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleFilterClose}
        >
          <MenuItem onClick={() => handleFilterSelect('all')}>Toutes les colonnes</MenuItem>
          {columns.map((column) => (
            <MenuItem 
              key={column.id} 
              onClick={() => handleFilterSelect(column.id)}
            >
              {column.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell style={{ minWidth: 100, fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format ? column.format(value) : value}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Box sx={{ display: 'flex' }}>
                            {onEdit && (
                              <Tooltip title="Modifier">
                                <IconButton onClick={() => onEdit(row)}>
                                  <EditIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onDelete && (
                              <Tooltip title="Supprimer">
                                <IconButton onClick={() => onDelete(row._id)}>
                                  <DeleteIcon color="error" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onBlock && (
                              <Tooltip title={row.isBlocked ? "Débloquer" : "Bloquer"}>
                                <IconButton onClick={() => onBlock(row._id, row.isBlocked)}>
                                  <BlockIcon color={row.isBlocked ? "success" : "warning"} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onRoleChange && (
                              <Tooltip title={row.role === 'admin' ? "Définir comme utilisateur" : "Définir comme admin"}>
                                <IconButton onClick={() => onRoleChange(row._id, row.role === 'admin' ? 'user' : 'admin')}>
                                  {row.role === 'admin' ? 
                                    <AdminIcon color="primary" /> : 
                                    <UserIcon color="action" />
                                  }
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
          />
        </>
      )}
    </Paper>
  );
};

export default DataTable;