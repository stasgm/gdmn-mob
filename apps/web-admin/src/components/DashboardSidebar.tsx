import { useState } from 'react';
import { Box, Divider, Drawer, List } from '@mui/material';
import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Smartphone as TabletIcon,
  Briefcase as BriefcaseIcon,
  Activity as ProcessIcon,
  Box as BoxIcon,
  File as FileIcon,
  Server as ServerIcon,
  AlertCircle as AlertIcon,
} from 'react-feather';

import { useSelector } from '@lib/store';

import { adminPath } from '../utils/constants';

import NavItem from './NavItem';
import NavToggle from './NavToggle';

interface IProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const DashboardSidebar = ({ onMobileClose, openMobile }: IProps) => {
  const [isCompact, setCompact] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const items =
    user?.role === 'SuperAdmin'
      ? [
          {
            href: `${adminPath}/app/dashboard`,
            icon: BarChartIcon,
            title: 'Сводка',
          },
          {
            href: `${adminPath}/app/appSystems`,
            icon: BoxIcon,
            title: 'Подсистемы',
          },
          {
            href: `${adminPath}/app/companies`,
            icon: BriefcaseIcon,
            title: 'Компании',
          },
          {
            href: `${adminPath}/app/users`,
            icon: UsersIcon,
            title: 'Пользователи',
          },
          {
            href: `${adminPath}/app/devices`,
            icon: TabletIcon,
            title: 'Устройства',
          },
          {
            href: `${adminPath}/app/processes`,
            icon: ProcessIcon,
            title: 'Процессы',
          },
          {
            href: `${adminPath}/app/deviceLogs`,
            icon: AlertIcon,
            title: 'Журналы ошибок',
          },
          {
            href: `${adminPath}/app/files`,
            icon: FileIcon,
            title: 'Файловая система',
          },
          {
            href: `${adminPath}/app/serverLogs`,
            icon: ServerIcon,
            title: 'Сервер',
          },
          {
            href: `${adminPath}/app/account`,
            icon: SettingsIcon,
            title: 'Профиль',
          },
        ]
      : [
          {
            href: `${adminPath}/app/dashboard`,
            icon: BarChartIcon,
            title: 'Сводка',
          },
          {
            href: `${adminPath}/app/appSystems`,
            icon: BoxIcon,
            title: 'Подсистемы',
          },
          {
            href: `${adminPath}/app/companies`,
            icon: BriefcaseIcon,
            title: 'Компании',
          },
          {
            href: `${adminPath}/app/users`,
            icon: UsersIcon,
            title: 'Пользователи',
          },
          {
            href: `${adminPath}/app/devices`,
            icon: TabletIcon,
            title: 'Устройства',
          },
          {
            href: `${adminPath}/app/processes`,
            icon: ProcessIcon,
            title: 'Процессы',
          },
          {
            href: `${adminPath}/app/account`,
            icon: SettingsIcon,
            title: 'Профиль',
          },
        ];

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexGrow: Number(isCompact ? 0 : 1),
      }}
    >
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
