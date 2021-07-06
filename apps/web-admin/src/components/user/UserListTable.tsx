import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import { IUser } from '@lib/types';

interface props {
  users?: IUser[];
}

const UserListTable = ({ users = [] }: props) => {
  const [selectedUserIds, setSelectedUserIds] = useState<any>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event: any) => {
    let newSelectedUserIds;

    if (event.target.checked) {
      newSelectedUserIds = users.map((user: any) => user.id);
    } else {
      newSelectedUserIds = [];
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (_event: any, id: any) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds: any = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
        selectedUserIds.slice(0, selectedIndex),
        selectedUserIds.slice(selectedIndex + 1),
      );
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  const TableRows = () => {
    const userList = users.slice(page * limit, page * limit + limit).map((user: IUser) => (
      <TableRow hover key={user.id} selected={selectedUserIds.indexOf(user.id) !== -1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedUserIds.indexOf(user.id) !== -1}
            onChange={(event) => handleSelectOne(event, user.id)}
            value="true"
          />
        </TableCell>
        <TableCell style={{ padding: '0 16px' }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <NavLink to={`/app/users/${user.id}`}>
              <Typography color="textPrimary" variant="body1" key={user.id}>
                {user.name}
              </Typography>
            </NavLink>
          </Box>
        </TableCell>
        <TableCell>{user.lastName}</TableCell>
        <TableCell>{user.firstName}</TableCell>
        <TableCell>{user.phoneNumber}</TableCell>
        <TableCell>{new Date(user.creationDate || '').toLocaleString('en-US', { hour12: false })}</TableCell>
        <TableCell>{new Date(user.editionDate || '').toLocaleString('en-US', { hour12: false })}</TableCell>
      </TableRow>
    ));

    const emptyRows = limit - Math.min(limit, users.length - page * limit);

    return (
      <>
        {userList}
        {emptyRows > 0 && page > 0 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={4} />
          </TableRow>
        )}
      </>
    );
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050, p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUserIds.length === users.length}
                    color="primary"
                    indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < users.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Фамилия</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell>Дата редактирования</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRows />
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={users.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default UserListTable;
