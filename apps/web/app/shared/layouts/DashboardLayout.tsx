import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { Sidebar } from '../components/sidebar';
import { Toast } from '../components/toast';

export const DashboardLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
        <Toast />
      </Box>
    </Box>
  );
};
