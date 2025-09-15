import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Paper, Link, Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Person, Lock, Group } from '@mui/icons-material';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        password,
        role,
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      setError('Đăng ký thất bại: ' + (err.response?.data || 'Lỗi mạng'));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 400 }}>
        <Box display="flex" justifyContent="center" mb={3}>
          <Typography variant="h5" component="h1" fontWeight="bold" color="primary">
            Đăng Ký
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField
            label="Tên Người Dùng"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <Person sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
          />
          <TextField
            label="Mật Khẩu"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <Lock sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Vai Trò</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Vai Trò"
              startAdornment={
                <Group sx={{ color: 'action.active', mr: 1 }} />
              }
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            Đăng Ký
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Đã có tài khoản?{' '}
            <Link component={RouterLink} to="/login" color="primary">
              Đăng Nhập
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;