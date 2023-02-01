import { Box, Container } from '@material-ui/core';
import { useCallback, useEffect, useRef, useState } from 'react';
// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { IUser } from '@lib/types';

import SortableTable from '../../components/SortableTable';
// import UserListTable from '../../components/user/UserListTable';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import actions from '../../store/user';
import companyActions from '../../store/company';

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
    fetchUsers(pageParams?.filterText as string);
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
    // const inputValue = valueRef?.current?.value;

    // fetchUsers(inputValue);
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

  const newPageParams: IPageParam = { limit: pageParams?.companyLimit, page: pageParams?.companyPage };

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
          // valueRef={valueRef}
          updateInput={handleUpdateInput}
          searchOnClick={handleSearchClick}
          keyPress={handleKeyPress}
          value={(pageParamLocal?.filterText as undefined) || ''}
          clearOnClick={handleClearSearch}
        />
        <Box /*sx={{ pt: 2 }}*/>
          {/* <UserListTable users={users} /> */}
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
