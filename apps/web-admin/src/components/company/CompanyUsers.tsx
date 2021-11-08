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
  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { pageParams } = useSelector((state) => state.users);

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const fetchUsers = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      console.log('fetch', filterText);
      dispatch(actions.fetchUsers('', filterText, fromRecord, toRecord));
      console.log('fetch filter', filterText);
    },
    [dispatch],
  );

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    console.log('use', pageParams?.filterText);
    fetchUsers(pageParams?.filterText as string);
  }, [fetchUsers, pageParams?.filterText]);

  // useEffect(() => {
  //   fetchUsers();
  // }, [fetchUsers]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });
    console.log('update filter', value);

    if (inputValue) return;

    fetchUsers('');
  };

  const handleSearchClick = () => {
    dispatch(actions.userActions.setPageParam({ filterText: pageParamLocal?.filterText }));
    console.log('pageParamLocal', pageParamLocal?.filterText);
    fetchUsers(pageParamLocal?.filterText as string);
    console.log('pageParamLocal filter', pageParamLocal?.filterText);
    // const inputValue = valueRef?.current?.value;

    // fetchUsers(inputValue);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;
    handleSearchClick();
    // const inputValue = valueRef?.current?.value;

    // fetchUsers(inputValue);
  };

  const userButtons: IToolBarButton[] = [
    // {
    //   name: 'Добавить',
    //   color: 'primary',
    //   variant: 'contained',
    //   onClick: () => navigate('app/users/new'),
    //   icon: <AddCircleOutlineIcon />,
    // },
  ];

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
        />
        <Box /*sx={{ pt: 2 }}*/>
          {/* <UserListTable users={users} /> */}
          <SortableTable<IUser> headCells={headCells} data={users} path={'/app/users/'} />
        </Box>
      </Container>
    </Box>
  );
};

export default CompanyUsers;
