import { Box, Container } from '@material-ui/core';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { IUser } from '@lib/types';

import SortableTable from '../../components/SortableTable';

import UserListTable from '../../components/user/UserListTable';
import { IHeadCells, IToolBarButton } from '../../types';
import ToolbarActions from '../ToolBarActions';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';

interface IProps {
  users: IUser[];
}

const CompanyUsers = ({ users }: IProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const fetchUsers = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchUsers('', filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  // useEffect(() => {
  //   fetchUsers();
  // }, [fetchUsers]);

  const handleSearchClick = () => {
    const inputValue = valueRef?.current?.value;

    fetchUsers(inputValue);
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
    { id: 'creationDate', label: 'Дата создания', sortEnable: false },
    { id: 'editionDate', label: 'Дата редактирования', sortEnable: false },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        {/* <ToolbarActions buttons={userButtons} /> */}
        <ToolbarActionsWithSearch
          buttons={userButtons}
          title={'Найти устройство'}
          searchOnClick={handleSearchClick}
          onChangeValue={() => {
            return;
          }}
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
