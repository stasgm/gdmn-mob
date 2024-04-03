import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { IUser } from '@lib/types';

import SortableTable from '../../components/SortableTable';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import { userActions } from '../../store/user';
import CircularProgressWithContent from '../CircularProgressWidthContent';

const headCells: IHeadCells<IUser>[] = [
  { id: 'name', label: 'Пользователь', sortEnable: true },
  { id: 'id', label: 'Идентификатор', sortEnable: true },
  { id: 'lastName', label: 'Фамилия', sortEnable: true },
  { id: 'firstName', label: 'Имя', sortEnable: true },
  { id: 'phoneNumber', label: 'Телефон', sortEnable: false },
  { id: 'creationDate', label: 'Дата создания', sortEnable: true },
  { id: 'editionDate', label: 'Дата редактирования', sortEnable: true },
];

interface IProps {
  users: IUser[];
}

const CompanyUsers = ({ users }: IProps) => {
  const dispatch = useDispatch();
  const { loading, pageParams } = useSelector((state) => state.users);
  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const fetchUsers = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(userActions.fetchUsers('', filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    fetchUsers(pageParams?.filterText);
  }, [fetchUsers, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    fetchUsers('');
  };

  const handleSearchClick = () => {
    dispatch(userActions.setPageParam({ filterText: pageParamLocal?.filterText }));
    fetchUsers(pageParamLocal?.filterText as string);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;
    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(userActions.setPageParam({ filterText: undefined }));
    setPageParamLocal({ filterText: undefined });
    fetchUsers();
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        userActions.setPageParam({
          companyPage: pageParams.page,
          companyLimit: pageParams.limit,
        }),
      );
    },
    [dispatch],
  );

  const newPageParams: IPageParam = {
    limit: pageParams?.companyLimit && !isNaN(Number(pageParams?.limit)) ? Number(pageParams?.limit) : 10,
    page: pageParams?.companyPage && !isNaN(Number(pageParams?.page)) ? Number(pageParams.companyPage) : 0,
  };

  const userButtons: IToolBarButton[] = [];

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
        value={(pageParamLocal?.filterText as undefined) || ''}
        clearOnClick={handleClearSearch}
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
            pageParams={newPageParams}
          />
        </Box>
      )}
    </Box>
  );
};

export default CompanyUsers;
