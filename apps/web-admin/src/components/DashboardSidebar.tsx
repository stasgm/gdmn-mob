import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Divider, Drawer, Hidden, List, Typography } from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Users as UsersIcon,
} from 'react-feather';

import { useSelector } from '@lib/store';

import NavItem from './NavItem';
import NavToggle from './NavToggle';

const userInfo = {
  avatar: '../assets/images/avatar_1.png',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith',
};

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Сводка',
  },
  {
    href: '/app/companies',
    icon: UsersIcon,
    title: 'Организации',
  },
  {
    href: '/app/users',
    icon: ShoppingBagIcon,
    title: 'Пользователи',
  },
  {
    href: '/app/devices',
    icon: UserIcon,
    title: 'Устройства',
  },
  {
    href: '/app/account',
    icon: SettingsIcon,
    title: 'Профиль',
  },
];

interface IProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const DashboardSidebar = ({ onMobileClose, openMobile }: IProps) => {
  const [isCompact, setCompact] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexGrow: Number(isCompact ? 0 : 1),
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: Number(isCompact ? 1 : 2),
        }}
      >
        <Avatar
          component={RouterLink}
          src={userInfo.avatar}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64,
          }}
          to="/app/account"
        />
        <Typography color="textPrimary" variant="h5">
          {!isCompact
            ? `${user?.lastName || ''} ${user?.firstName || ''}`
            : `${user?.lastName?.slice(0, 1)}${user?.firstName?.slice(0, 1)}`}
        </Typography>
        {!isCompact && (
          <Typography color="textSecondary" variant="body2">
            {userInfo.jobTitle}
          </Typography>
        )}
      </Box>
      <Divider />
      <Box sx={{ p: Number(isCompact ? 0 : 2) }}>
        <List>
          {items.map((item) => (
            <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} compact={isCompact} />
          ))}
        </List>
      </Box>
      <Divider />
      <NavToggle compact={isCompact} setCompact={setCompact} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: isCompact ? 70 : 256,
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: isCompact ? 70 : 256,
              top: 64,
              height: 'calc(100% - 64px)',
              transitionProperty: 'width, transform !important',
              transitionDuration: '0.3s !important',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 1, 1) !important',
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default DashboardSidebar;
