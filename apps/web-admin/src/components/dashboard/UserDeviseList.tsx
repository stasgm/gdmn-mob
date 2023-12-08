import { useState, useEffect } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import { ICompany, IUser } from '@lib/types';

import deviceSelectors from '../../store/device/selectors';

import userSelectors from '../../store/user/selectors';
import PeriodList from '../../components/dashboard/PeriodList';

interface IProps {
  company: ICompany | undefined;
  onClickUser: (selectedUser: IUser) => void;
  onClickSelectedPeriod: (timePeriod: string[]) => void;
}

const UserDeviseList = ({ company, onClickUser, onClickSelectedPeriod }: IProps) => {
  const users = userSelectors.usersByCompanyId(company?.id);
  const device = deviceSelectors.deviceByCompanyId(company?.id);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const date = new Date();
  const [timePeriod, setTimePeriod] = useState<string[]>([
    String(date.getFullYear()) + '.' + String(date.getMonth() + 1) + '.' + String(date.getDate()),
    String(date.getFullYear()) + '.' + String(date.getMonth() + 1) + '.' + String(date.getDate()),
  ]);

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  const TableRows = () => {
    const appSystemList = users.slice(page * limit, page * limit + limit).map((user: IUser) => {
      return (
        <TableRow hover key={user.id}>
          <TableCell style={{ padding: '0 16px' }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
              onClick={() => onClickUser(user)}
              style={{ textAlign: 'center', cursor: 'pointer' }}
            >
              <Typography color="textPrimary" variant="body1" key={user.id}>
                {user.name}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>{user.id}</TableCell>
          <TableCell>{timePeriod}</TableCell>
          <TableCell>{user.id}</TableCell>
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, users.length - page * limit);

    return (
      <>
        {appSystemList}
        {emptyRows > 0 && page > 0 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={4} />
          </TableRow>
        )}
      </>
    );
  };

  return company ? (
    <>
      <Box ml={3} mt={2} right={10} style={{ justifyContent: 'end', display: 'flex', paddingRight: 30 }}>
        <PeriodList
          callBack={(period) => (setTimePeriod(period), onClickSelectedPeriod(period))}
          quarter={true}
          halfYear={true}
          year={true}
        />
      </Box>
      <Box m={3} ml={3} mr={3}>
        <Card>
          <PerfectScrollbar>
            <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight: window.innerHeight - 268 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Пользователь</TableCell>
                    {device.map((item, index) => (
                      <TableCell key={index}>{item.name}</TableCell>
                    ))}
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
      </Box>
    </>
  ) : null;
};
export default UserDeviseList;
