import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import { IUser } from '@lib/types';

import UserListTable from '../../components/user/UserListTable';
import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user/actions.async';

import CircularProgressWithContent from '../../components/CircularProgressWidthContent';

import { IToolBarButton } from '../../types';

const UserList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.users);
  const [dataList, setDataList] = useState<IUser[]>([]);

  const fetchUsers = useCallback(() => dispatch(actions.fetchUsers()), [dispatch]);

  useEffect(() => {
    /* Загружаем данные при загрузке компонента. В дальенйшем надо загружать при открытии приложения */
    fetchUsers();
    setDataList(list);
  }, [fetchUsers]);

  const handleUpdateInput = (event: any) => {
    const inputValue: string = event.target.value.toUpperCase();

    const filtered = list.filter((item) => {
      const name = item.name.toUpperCase();
      const firstname = typeof item.firstName === 'string' ? item.firstName.toUpperCase() : '';
      const lastName = typeof item.lastName === 'string' ? item.lastName.toUpperCase() : '';

      return name.includes(inputValue) || firstname.includes(inputValue) || lastName.includes(inputValue);
    });

    setDataList(filtered);
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchUsers(),
      icon: <CachedIcon />,
    },
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
      onClick: () => navigate(`${location.pathname}/new`),
      icon: <AddCircleOutlineIcon />,
    },
  ];

  console.log('list', list);

  return (
    <>
      <Helmet>
        <title>Пользователи</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <ToolbarActionsWithSearch
            buttons={buttons}
            searchTitle={'Найти пользователя'}
            updateInput={handleUpdateInput}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <UserListTable users={dataList} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default UserList;
