import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Stack, Box } from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  AccountCircle as UserIcon,
  Notifications as NotifIcon,
} from '@mui/icons-material';
import { useThemeStore } from '@core/store/themeStore';
import { useAppStore } from '@core/store/appStore';
import { useAuthStore } from '@core/store/authStore';
import { INavbarProps } from './Navbar.types';

export const Navbar: React.FC<INavbarProps> = () => {
  const { mode, toggleTheme } = useThemeStore();
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton edge="start" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="primary">
            GymFlow ERP
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" onClick={toggleTheme}>
            {mode === 'dark' ? <LightIcon fontSize="small" /> : <DarkIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small">
            <NotifIcon fontSize="small" />
          </IconButton>
          <Box sx={{ pl: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <UserIcon color="action" />
            <Typography variant="body2" fontWeight={600}>
              {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
