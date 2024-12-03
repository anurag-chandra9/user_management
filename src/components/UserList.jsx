import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Fab,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Zoom,
  Tooltip,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      showMessage('Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser({ ...user });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      showMessage('User deleted successfully', 'success');
    } catch (error) {
      showMessage('Error deleting user', 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${editUser.id}`, editUser);
      setUsers(users.map(user => 
        user.id === editUser.id ? editUser : user
      ));
      setEditUser(null);
      showMessage('User updated successfully', 'success');
    } catch (error) {
      showMessage('Error updating user', 'error');
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post('https://reqres.in/api/users', newUser);
      setUsers([response.data, ...users]);
      setIsAddDialogOpen(false);
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      });
      showMessage('User added successfully', 'success');
    } catch (error) {
      showMessage('Error adding user', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed AppBar */}
      
      <Container sx={{ py: 4 }}>
        <Snackbar
          open={!!message.text}
          autoHideDuration={3000}
          onClose={() => setMessage({ text: '', type: '' })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={message.type} sx={{ width: '100%' }}>
            {message.text}
          </Alert>
        </Snackbar>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {users.map((user) => (
                <Grid item key={user.id} xs={12} sm={6} md={4}>
                  <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {user.first_name} {user.last_name}
                        </Typography>
                        <Typography color="text.secondary">
                          {user.email}
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(user)}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(user.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          </>
        )}

        <Tooltip title="Add User">
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
            onClick={() => setIsAddDialogOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        {/* Edit User Dialog */}
        <Dialog 
          open={!!editUser} 
          onClose={() => setEditUser(null)}
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              fullWidth
              label="First Name"
              value={editUser?.first_name || ''}
              onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Last Name"
              value={editUser?.last_name || ''}
              onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={editUser?.email || ''}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditUser(null)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog 
          open={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)}
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              fullWidth
              label="First Name"
              value={newUser.first_name}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Last Name"
              value={newUser.last_name}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Avatar URL"
              value={newUser.avatar}
              onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddUser}>Add User</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UserList;
