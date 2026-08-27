import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as MembersIcon,
  FitnessCenter as FitnessIcon,
  Restaurant as NutritionIcon,
  AttachMoney as FinanceIcon,
  Inventory as InventoryIcon,
  Build as EquipmentIcon,
  CalendarToday as SchedulingIcon,
  ContactMail as CrmIcon,
  Message as CommunicationIcon,
  Assessment as ReportsIcon,
  Timeline as AnalyticsIcon,
  AdminPanelSettings as AdminIcon,
  Business as GymIcon,
  AccountCircle as ProfileIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@core/store/appStore';
import { SIDEBAR_MENU_CONFIG, ISidebarMenuItem } from '@core/config/sidebarConfig';
import { ISidebarProps } from './Sidebar.types';

const DOMAIN_ICONS: Record<string, React.ReactElement> = {
  auth: <AdminIcon fontSize="small" />,
  dashboard: <DashboardIcon fontSize="small" />,
  administration: <AdminIcon fontSize="small" />,
  'gym-management': <GymIcon fontSize="small" />,
  'member-management': <MembersIcon fontSize="small" />,
  fitness: <FitnessIcon fontSize="small" />,
  nutrition: <NutritionIcon fontSize="small" />,
  crm: <CrmIcon fontSize="small" />,
  finance: <FinanceIcon fontSize="small" />,
  inventory: <InventoryIcon fontSize="small" />,
  equipment: <EquipmentIcon fontSize="small" />,
  scheduling: <SchedulingIcon fontSize="small" />,
  communication: <CommunicationIcon fontSize="small" />,
  reports: <ReportsIcon fontSize="small" />,
  analytics: <AnalyticsIcon fontSize="small" />,
  profile: <ProfileIcon fontSize="small" />,
};

export const Sidebar: React.FC<ISidebarProps> = () => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    'member-management': true,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Drawer
      variant="persistent"
      open={sidebarOpen}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={800} color="primary">
          GymFlow Enterprise
        </Typography>
        <Typography variant="caption" color="text.secondary">
          v1.0.0 Enterprise SaaS
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 1, overflowY: 'auto' }}>
        {SIDEBAR_MENU_CONFIG.filter((m) => m.id !== 'auth').map((menu: ISidebarMenuItem) => {
          const isOpen = !!openGroups[menu.id];
          const hasChildren = menu.children && menu.children.length > 0;
          const isGroupActive = location.pathname.startsWith('/' + menu.id);

          return (
            <React.Fragment key={menu.id}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => (hasChildren ? toggleGroup(menu.id) : navigate(menu.path))}
                  sx={{
                    borderRadius: 1.5,
                    bgcolor: isGroupActive ? 'action.selected' : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isGroupActive ? 'primary.main' : 'text.secondary' }}>
                    {DOMAIN_ICONS[menu.id] || <DashboardIcon fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={menu.title}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isGroupActive ? 700 : 500 }}
                  />
                  {hasChildren && (isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
                </ListItemButton>
              </ListItem>

              {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    {menu.children!.map((child) => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <ListItem key={child.id} disablePadding sx={{ mb: 0.25 }}>
                          <ListItemButton
                            selected={isChildActive}
                            onClick={() => navigate(child.path)}
                            sx={{
                              borderRadius: 1.5,
                              py: 0.75,
                              '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': { bgcolor: 'primary.dark' },
                              },
                            }}
                          >
                            <ListItemText
                              primary={child.title}
                              primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: isChildActive ? 600 : 400 }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Drawer>
  );
};
