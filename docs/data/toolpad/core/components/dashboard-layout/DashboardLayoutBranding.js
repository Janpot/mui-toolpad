import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import theme from '../theme';

const NAVIGATION = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
];

const BRANDING = {
  logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
  title: 'MUI',
};

export default function BrandingDashboardLayout() {
  return (
    <AppProvider theme={theme} navigation={NAVIGATION} branding={BRANDING}>
      <DashboardLayout>
        <Box
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography>Dashboard content goes here.</Typography>
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
