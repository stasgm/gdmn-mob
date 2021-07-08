import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';

import { IUser } from '@lib/types';

import UserListTable from '../../components/user/UserListTable';
import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import { IToolBarButton } from '../../types';
import SnackBar from '../../components/SnackBar';

const UserList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading, errorMessage, pageParams } = useSelector((state) => state.users);
  const [users, setUsers] = useState<IUser[]>();
  const filterValue = pageParams?.filter as string | undefined;

  const fetchUsers = useCallback(() => {
    dispatch(actions.fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const inputValue = filterValue?.toUpperCase();

    const filtered = inputValue
      ? list.filter((item) => {
          const name = item.name.toUpperCase();
          const firstname = typeof item.firstName === 'string' ? item.firstName.toUpperCase() : '';
          const lastName = typeof item.lastName === 'string' ? item.lastName.toUpperCase() : '';

          return name.includes(inputValue) || firstname.includes(inputValue) || lastName.includes(inputValue);
        })
      : list;

    setUsers(filtered);
  }, [list, filterValue]);

  const handleFilterUsers = (value: string) => {
    dispatch(actions.userActions.setPageParam({ filter: value }));
  };

  const handleClearError = () => {
    dispatch(actions.userActions.clearError());
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchUsers(),
      icon: <CachedIcon />,
    },
    // {
    //   name: 'Загрузить',
    //   onClick: () => {
    //     return;
    //   },
    //   icon: <ImportExportIcon />,
    // },
    // {
    //   name: 'Выгрузить',
    //   sx: { mx: 1 },
    //   onClick: () => {
    //     return;
    //   },
    // },
    {
      name: 'Добавить',
      color: 'primary',
      variant: 'contained',
      onClick: () => navigate(`${location.pathname}/new`),
      icon: <AddCircleOutlineIcon />,
    },
  ];

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
            title={'Найти пользователя'}
            value={filterValue}
            onChangeValue={handleFilterUsers}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <UserListTable users={users} />
            </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default UserList;
