import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Divider, Drawer, List, Typography } from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Users as UsersIcon,
} from 'react-feather';

import { useSelector, useDispatch } from '@lib/store';

import { adminPath } from '../utils/constants';

import actions from '../store/user';

import NavItem from './NavItem';
import NavToggle from './NavToggle';

const userInfo = {
  avatar: '/assets/images/avatar1.svg',
  jobTitle: 'User',
  name: 'Katarina Smith',
};

const items = [
  {
    href: `${adminPath}/app/dashboard`,
    icon: BarChartIcon,
    title: 'Сводка',
  },
  {
    href: `${adminPath}/app/companies`,
    icon: UsersIcon,
    title: 'Компании',
  },
  {
    href: `${adminPath}/app/users`,
    icon: ShoppingBagIcon,
    title: 'Пользователи',
  },
  {
    href: `${adminPath}/app/devices`,
    icon: UserIcon,
    title: 'Устройства',
  },
  {
    href: `${adminPath}/app/account`,
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

  // const dispatch = useDispatch();

  // const fetchUsers = useCallback(
  //   (filterText?: string, fromRecord?: number, toRecord?: number) => {
  //     dispatch(actions.fetchUsers('', filterText, fromRecord, toRecord));
  //   },
  //   [dispatch],
  // );

  // useEffect(() => {
  //   dispatch(actions.fetchUsers(''));
  //   //   },
  //   //   [dispatch],
  // }, [dispatch]);

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
          to={`${adminPath}/app/account`}
        />
        <Typography color="textPrimary" variant="h5">
          {!isCompact
            ? `${user?.lastName || ''} ${user?.firstName || ''}`
            : `${user?.lastName?.slice(0, 1) || ''}${user?.firstName?.slice(0, 1) || ''}`}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {userInfo.jobTitle}
        </Typography>
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
      <Box
        sx={{ background: 'transparent', border: 'none', display: { xl: 'none', xs: 'block' } }}
        onMouseLeave={onMobileClose}
      >
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
      </Box>
      <Box sx={{ background: 'transparent', border: 'none', display: { xs: 'none', lg: 'block' } }}>
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
      </Box>
    </>
  );
};

export default DashboardSidebar;
