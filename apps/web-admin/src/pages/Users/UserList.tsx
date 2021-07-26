import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';

import { IUser } from '@lib/types';

import SortableTable from '../../components/SortableTable';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import { IToolBarButton, IHeadCells } from '../../types';
import SnackBar from '../../components/SnackBar';

const UserList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { list, loading, errorMessage } = useSelector((state) => state.users);

  const fetchUsers = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchUsers('', filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
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
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default UserList;
