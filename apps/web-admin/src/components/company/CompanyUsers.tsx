import { Box, Container } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { IUser } from '@lib/types';

import SortableTable from '../../components/SortableTable';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import actions from '../../store/user';

interface IProps {
  users: IUser[];
}

const CompanyUsers = ({ users }: IProps) => {
  const dispatch = useDispatch();

  const { pageParams } = useSelector((state) => state.users);

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const fetchUsers = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchUsers('', filterText, fromRecord, toRecord));
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
    dispatch(actions.userActions.setPageParam({ filterText: pageParamLocal?.filterText }));
    fetchUsers(pageParamLocal?.filterText as string);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;
    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(actions.userActions.setPageParam({ filterText: undefined }));
    setPageParamLocal({ filterText: undefined });
    fetchUsers();
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        actions.userActions.setPageParam({
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

  const headCells: IHeadCells<IUser>[] = [
    { id: 'name', label: 'Пользователь', sortEnable: true },
    { id: 'lastName', label: 'Фамилия', sortEnable: true },
    { id: 'firstName', label: 'Имя', sortEnable: true },
    { id: 'phoneNumber', label: 'Телефон', sortEnable: false },
    { id: 'creationDate', label: 'Дата создания', sortEnable: true },
    { id: 'editionDate', label: 'Дата редактирования', sortEnable: true },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        <ToolbarActionsWithSearch
          buttons={userButtons}
          searchTitle={'Найти пользователя'}
          updateInput={handleUpdateInput}
          searchOnClick={handleSearchClick}
          keyPress={handleKeyPress}
          value={(pageParamLocal?.filterText as undefined) || ''}
          clearOnClick={handleClearSearch}
        />
        <Box>
          <SortableTable<IUser>
            headCells={headCells}
            data={users}
            path={'/app/users/'}
            onSetPageParams={handleSetPageParams}
            pageParams={newPageParams}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default CompanyUsers;
