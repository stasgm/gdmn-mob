import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Badge, Box, IconButton, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';

import { authActions } from '@lib/store';

import Logo from './Logo';

interface IProps {
  onMobileNavOpen: () => void;
}

const DashboardNavbar = ({ onMobileNavOpen, ...rest }: IProps) => {
  const [notifications] = useState([]);

  const dispatch = useDispatch();

  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          component="button"
          sx={{ background: 'transparent', border: 'none', display: { xs: 'none', lg: 'block' }, color: 'white' }}
        >
          <IconButton color="inherit">
            <Badge badgeContent={notifications.length} color="primary" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => dispatch(authActions.logout())}>
            <LogoutIcon />
          </IconButton>
        </Box>
        <Box
          component="button"
          sx={{ background: 'transparent', border: 'none', display: { xs: 'block', md: 'none' } }}
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
