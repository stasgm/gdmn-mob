import { Box } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IUser } from '@lib/types';
import CachedIcon from '@mui/icons-material/Cached';

import SortableTable from '../../components/SortableTable';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import { userActions, userSelectors } from '../../store/user';
import CircularProgressWithContent from '../CircularProgressWidthContent';

const headCells: IHeadCells<IUser>[] = [
  { id: 'id', label: 'Идентификатор', sortEnable: true },
  { id: 'name', label: 'Пользователь', sortEnable: true },
  { id: 'lastName', label: 'Фамилия', sortEnable: true },
  { id: 'firstName', label: 'Имя', sortEnable: true },
  { id: 'phoneNumber', label: 'Телефон', sortEnable: false },
  { id: 'creationDate', label: 'Дата создания', sortEnable: true, type: 'date' },
  { id: 'editionDate', label: 'Дата редактирования', sortEnable: true, type: 'date' },
];

interface IProps {
  companyId: string;
}

const CompanyUsers = ({ companyId }: IProps) => {
  const dispatch = useDispatch();
  const { loading, pageParams } = useSelector((state) => state.users);
  const users = userSelectors.usersByCompanyId(companyId);
  const [filterText, setFilterText] = useState(pageParams?.filterText || '');

  const prevFilterTextRef = useRef<string | undefined | null>(null);

  const fetchUsers = useCallback(() => {
    dispatch(userActions.fetchUsers(companyId, pageParams?.filterText));
  }, [companyId, dispatch, pageParams?.filterText]);

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

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(userActions.setPageParam({ filterText: '', page: 0 }));
    setFilterText('');
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

  const userButtons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: fetchUsers,
      icon: <CachedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <ToolbarActionsWithSearch
        buttons={userButtons}
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
            data={users}
            path={'/app/users/'}
            onSetPageParams={handleSetPageParams}
            pageParams={pageParams}
            byMaxHeight={true}
            minusHeight={112}
          />
        </Box>
      )}
    </Box>
  );
};

export default CompanyUsers;
