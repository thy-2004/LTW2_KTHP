import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Paper, Link, Alert,
} from '@mui/material';
import { Person, Lock } from '@mui/icons-material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      });

      if (response.status === 200) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
//lấy thông tin user
        const userResponse = await axios.get('http://localhost:8080/api/user/current-user', {
          withCredentials: true
        });
        const user = userResponse.data;

        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (err) {
      setError('Đăng nhập thất bại: ' + (err.response?.data || 'Lỗi mạng'));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 400 }}>
        <Box display="flex" justifyContent="center" mb={3}>
          <Typography variant="h5" component="h1" fontWeight="bold" color="primary">
            Đăng Nhập
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            Đăng Nhập
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Bạn chưa có tài khoản?{' '}
            <Link component={RouterLink} to="/register" color="primary">
              Đăng Ký
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;