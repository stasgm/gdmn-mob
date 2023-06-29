import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Badge, Box, IconButton, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import { adminPath } from '../utils/constants';

import { webRequest } from '../store/webRequest';

import Logo from './Logo';

interface IProps {
  onMobileNavOpen: () => void;
}

const DashboardNavbar = ({ onMobileNavOpen, ...rest }: IProps) => {
  const [notifications] = useState([]);

  const authDispatch = useAuthThunkDispatch();

  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to={`${adminPath}/`}>
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            background: 'transparent',
            border: 'none',
            color: 'white',
          }}
        >
          <IconButton color="inherit">
            <Badge badgeContent={notifications.length} color="primary" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => authDispatch(authActions.logout(webRequest(authDispatch, authActions)))}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            background: 'transparent',
            border: 'none',
            display: { xs: 'block', md: 'block', lg: 'none' },
            color: 'white',
          }}
        >
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;
