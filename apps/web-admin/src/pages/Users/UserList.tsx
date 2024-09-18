import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CachedIcon from '@mui/icons-material/Cached';

import { IUser } from '@lib/types';

import SortableTable from '../../components/SortableTable';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import { userActions } from '../../store/user';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import { IToolBarButton, IHeadCells, IPageParam } from '../../types';

const UserList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading, pageParams } = useSelector((state) => state.users);
  const [filterText, setFilterText] = useState(pageParams?.filterText || '');
  const prevFilterTextRef = useRef<string | undefined | null>(null);

  const fetchUsers = useCallback(() => {
    dispatch(userActions.fetchUsers('', pageParams?.filterText));
  }, [dispatch, pageParams?.filterText]);

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента или при изменении фильтра
    if (prevFilterTextRef.current !== pageParams?.filterText) {
      prevFilterTextRef.current = pageParams?.filterText;
      fetchUsers();
    }
  }, [fetchUsers, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    setFilterText(value);

    if (value) return;
    dispatch(userActions.setPageParam({ filterText: '', page: 0 }));
  };

  const handleSearchClick = () => {
    dispatch(userActions.setPageParam({ filterText, page: 0 }));
  };

  const handleClearSearch = () => {
    dispatch(userActions.setPageParam({ filterText: '', page: 0 }));
    setFilterText('');
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleSetPageParams = useCallback(
    (newParams: IPageParam) => {
      dispatch(
        userActions.setPageParam({
          page: newParams.page,
          limit: newParams.limit,
        }),
      );
    },
    [dispatch],
  );

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: fetchUsers,
      icon: <CachedIcon />,
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
    { id: 'id', label: 'Идентификатор', sortEnable: true },
    { id: 'lastName', label: 'Фамилия', sortEnable: true },
    { id: 'firstName', label: 'Имя', sortEnable: true },
    { id: 'externalId', label: 'Идентификатор из ERP', sortEnable: true },
    { id: 'erpUser', label: 'Пользователь ERP', sortEnable: true },
    { id: 'appSystem', label: 'Подсистема', sortEnable: true },
    { id: 'creationDate', label: 'Дата создания', sortEnable: true },
    { id: 'editionDate', label: 'Дата редактирования', sortEnable: true },
  ];

  return (
    <>
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
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
            value={filterText}
            clearOnClick={handleClearSearch}
            disabled={loading}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <SortableTable<IUser>
                headCells={headCells}
                data={list}
                path={'/app/users/'}
                onSetPageParams={handleSetPageParams}
                pageParams={pageParams}
                byMaxHeight={true}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default UserList;
