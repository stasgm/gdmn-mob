import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import { IUser, IHeadCells } from '@lib/types';

import SortableTable from '../../components/SortableTable';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user/actions.async';

import CircularProgressWithContent from '../../components/CircularProgressWidthContent';

import { IToolBarButton } from '../../types';

const UserList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { list, loading } = useSelector((state) => state.users);

  const fetchUsers = useCallback(
    async (filterText?: string, fromRecord?: number, toRecord?: number) => {
      const res = await dispatch(actions.fetchUsers('', filterText, fromRecord, toRecord));

      if (res.type === 'USER/FETCH_USERS_SUCCESS') {
        //setDataList(res.payload);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    /* Загружаем данные при загрузке компонента. В дальенйшем надо загружать при открытии приложения */
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    if (inputValue) return;

    fetchUsers('');
  };

  const handleSearchClick = () => {
    const inputValue = valueRef?.current?.value;

    fetchUsers(inputValue);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    const inputValue = valueRef?.current?.value;

    fetchUsers(inputValue);
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

  const headCells: IHeadCells<IUser>[] = [
    { id: 'name', label: 'Пользователь', sortEnable: true },
    { id: 'lastName', label: 'Фамилия', sortEnable: true },
    { id: 'firstName', label: 'Имя', sortEnable: true },
    { id: 'phoneNumber', label: 'Телефон', sortEnable: false },
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
            searchTitle={'Найти пользователя'}
            valueRef={valueRef}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <SortableTable<IUser> headCells={headCells} data={list} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default UserList;
