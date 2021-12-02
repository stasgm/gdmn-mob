import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Badge, Box, IconButton, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import { adminPath } from '../utils/constants';

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
          <IconButton color="inherit" onClick={() => authDispatch(authActions.logout())}>
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
