import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Paper, Alert, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  AppBar, Toolbar, Divider
} from '@mui/material';
import { Add, Edit, Delete, Save, Cancel, Logout } from '@mui/icons-material';

const UserDashboard = () => {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [newTable, setNewTable] = useState({ tableNumber: '', content: '', status: 'AVAILABLE' });
  const [editTable, setEditTable] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

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
            Trang Người Dùng
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

        {/* Quản Lý Bàn */}
        <Typography variant="h5" gutterBottom sx={{ mt: 2, color: '#1976d2' }}>
          Quản Lý Bàn
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Tạo Bàn */}
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

        {/* Sửa Bàn */}
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

        {/* Danh Sách Bàn */}
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

export default UserDashboard;
