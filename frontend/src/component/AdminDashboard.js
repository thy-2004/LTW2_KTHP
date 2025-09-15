import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  AppBar, Toolbar, Divider, Alert
} from '@mui/material';
import { Add, Edit, Delete, Save, Cancel, Logout } from '@mui/icons-material';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'USER' });
  const [newTable, setNewTable] = useState({ tableNumber: '', content: '', status: 'AVAILABLE' });
  const [editUser, setEditUser] = useState(null);
  const [editTable, setEditTable] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchTables();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/users', { withCredentials: true });
      setUsers(response.data);
    } catch (err) {
      const errorMessage = err.response
        ? `Không thể tải danh sách người dùng: ${err.response.status} - ${err.response.data || 'Không có thông điệp lỗi'}`
        : 'Không thể tải danh sách người dùng: Lỗi mạng';
      setError(errorMessage);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/tables', { withCredentials: true });
      setTables(response.data);
    } catch (err) {
      const errorMessage = err.response
        ? `Không thể tải danh sách bàn: ${err.response.status} - ${err.response.data || 'Không có thông điệp lỗi'}`
        : 'Không thể tải danh sách bàn: Lỗi mạng';
      setError(errorMessage);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/admin/users', newUser, { withCredentials: true });
      fetchUsers();
      setNewUser({ username: '', password: '', role: 'USER' });
    } catch (err) {
      const errorMessage = err.response
        ? `Tạo người dùng thất bại: ${err.response.status} - ${err.response.data || 'Không có thông điệp lỗi'}`
        : 'Tạo người dùng thất bại: Lỗi mạng';
      setError(errorMessage);
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/admin/tables', newTable, { withCredentials: true });
      fetchTables();
      setNewTable({ tableNumber: '', content: '', status: 'AVAILABLE' });
    } catch (err) {
      const errorMessage = err.response
        ? `Tạo bàn thất bại: ${err.response.status} - ${err.response.data || 'Không có thông điệp lỗi'}`
        : 'Tạo bàn thất bại: Lỗi mạng';
      setError(errorMessage);
    }
  };

  const handleEditUser = (user) => {
    setEditUser({ ...user, password: '' });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${editUser.id}`, editUser, { withCredentials: true });
      fetchUsers();
      setEditUser(null);
    } catch (err) {
      const errorMessage = err.response
        ? `Cập nhật người dùng thất bại: ${err.response.status} - ${err.response.data || 'Không có thông điệp lỗi'}`
        : 'Cập nhật người dùng thất bại: Lỗi mạng';
      setError(errorMessage);
    }
  };

  const handleEditTable = (table) => {
    setEditTable({ ...table });
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/admin/tables/${editTable.id}`, editTable, { withCredentials: true });
      fetchTables();
      setEditTable(null);
    } catch (err) {
      const errorMessage = err.response
        ? `Cập nhật bàn thất bại: ${err.response.status} - ${err.response.data || 'Không có thông điệp lỗi'}`
        : 'Cập nhật bàn thất bại: Lỗi mạng';
      setError(errorMessage);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      const errorMessage = err.response
        ? `Xóa người dùng thất bại: ${err.response.status} - ${err.response.data || 'Không có thông điệp lỗi'}`
        : 'Xóa người dùng thất bại: Lỗi mạng';
      setError(errorMessage);
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/tables/${id}`, { withCredentials: true });
      fetchTables();
    } catch (err) {
      const errorMessage = err.response
        ? `Xóa bàn thất bại: ${err.response.status} - ${err.response.data || 'Không có thông điệp lỗi'}`
        : 'Xóa bàn thất bại: Lỗi mạng';
      setError(errorMessage);
    }
  };

  const handleLogout = async () => {
    await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Header với nút Đăng Xuất */}
      <AppBar position="sticky" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Trang Quản Trị
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Đăng Xuất">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Phần Quản Lý Người Dùng */}
        <Typography variant="h5" gutterBottom sx={{ mt: 2, color: '#1976d2' }}>
          Quản Lý Người Dùng
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tạo Người Dùng
          </Typography>
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Tên Người Dùng"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Mật Khẩu"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              fullWidth
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Vai Trò</InputLabel>
              <Select
                value={newUser.role}
                label="Vai Trò"
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <MenuItem value="USER">Người Dùng</MenuItem>
                <MenuItem value="ADMIN">Quản Trị</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              type="submit"
              sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
            >
              Tạo
            </Button>
          </form>
        </Box>

        {editUser && (
          <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sửa Người Dùng
            </Typography>
            <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TextField
                label="Tên Người Dùng"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Mật Khẩu Mới (tùy chọn)"
                type="password"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                fullWidth
                variant="outlined"
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>Vai Trò</InputLabel>
                <Select
                  value={editUser.role}
                  label="Vai Trò"
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <MenuItem value="USER">USER</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  type="submit"
                  sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                >
                  Cập Nhật
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Cancel />}
                  onClick={() => setEditUser(null)}
                >
                  Hủy
                </Button>
              </Box>
            </form>
          </Box>
        )}

        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Danh Sách Người Dùng
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                  <TableCell>Tên Người Dùng</TableCell>
                  <TableCell>Vai Trò</TableCell>
                  <TableCell align="right">Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role === 'USER' ? 'USER' : 'ADMIN'}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEditUser(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Phần Quản Lý Bàn */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, color: '#1976d2' }}>
          Quản Lý Bàn
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tạo Bàn
          </Typography>
          <form onSubmit={handleCreateTable} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Số Bàn"
              value={newTable.tableNumber}
              onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Nội Dung"
              value={newTable.content}
              onChange={(e) => setNewTable({ ...newTable, content: e.target.value })}
              fullWidth
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Trạng Thái</InputLabel>
              <Select
                value={newTable.status}
                label="Trạng Thái"
                onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
              >
                <MenuItem value="AVAILABLE">Trống</MenuItem>
                <MenuItem value="OCCUPIED">Đã Đặt</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              type="submit"
              sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
            >
              Tạo
            </Button>
          </form>
        </Box>

        {editTable && (
          <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sửa Bàn
            </Typography>
            <form onSubmit={handleUpdateTable} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TextField
                label="Số Bàn"
                value={editTable.tableNumber}
                onChange={(e) => setEditTable({ ...editTable, tableNumber: e.target.value })}
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Nội Dung"
                value={editTable.content}
                onChange={(e) => setEditTable({ ...editTable, content: e.target.value })}
                fullWidth
                variant="outlined"
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>Trạng Thái</InputLabel>
                <Select
                  value={editTable.status}
                  label="Trạng Thái"
                  onChange={(e) => setEditTable({ ...editTable, status: e.target.value })}
                >
                  <MenuItem value="AVAILABLE">Trống</MenuItem>
                  <MenuItem value="OCCUPIED">Đã Đặt</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  type="submit"
                  sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                >
                  Cập Nhật
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Cancel />}
                  onClick={() => setEditTable(null)}
                >
                  Hủy
                </Button>
              </Box>
            </form>
          </Box>
        )}

        <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Danh Sách Bàn
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                  <TableCell>Số Bàn</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell align="right">Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tables.map(table => (
                  <TableRow key={table.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <TableCell>{table.tableNumber}</TableCell>
                    <TableCell>{table.status === 'AVAILABLE' ? 'Trống' : 'Đã Đặt'}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEditTable(table)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteTable(table.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;