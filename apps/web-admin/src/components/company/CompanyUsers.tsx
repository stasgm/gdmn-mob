import { Box, Container, CardHeader } from '@material-ui/core';

import { useNavigate } from 'react-router-dom';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

// import CachedIcon from '@material-ui/icons/Cached';

import ImportExportIcon from '@material-ui/icons/ImportExport';

import { IUser } from '@lib/types';

import UserListTable from '../../components/user/UserListTable';
import { IToolBarButton } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';

interface props {
  users: IUser[];
}

const CompanyUsers = ({ users }: props) => {
  const navigate = useNavigate();

  const userButtons: IToolBarButton[] = [
    // {
    //   name: 'Обновить',
    //   sx: { mx: 1 },
    //   onClick: () => {
    //     return;
    //   },
    //   icon: <CachedIcon />,
    // },
    {
      name: 'Загрузить',
      onClick: () => {
        return;
      },
      icon: <ImportExportIcon />,
    },
    {
      name: 'Выгрузить',
      sx: { mx: 1 },
      onClick: () => {
        return;
      },
    },
    {
      name: 'Добавить',
      color: 'primary',
      variant: 'contained',
      onClick: () => navigate('app/users/new'),
      icon: <AddCircleOutlineIcon />,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        <ToolbarActionsWithSearch buttons={userButtons} searchTitle={'Найти пользователя'} />
        <Box sx={{ pt: 2 }}>
          <UserListTable users={users} />
        </Box>
      </Container>
    </Box>
  );
};

export default CompanyUsers;
