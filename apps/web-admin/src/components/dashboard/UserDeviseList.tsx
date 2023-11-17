import { useState, useEffect } from 'react';
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
} from '@mui/material';

import { ICompany } from '@lib/types';

import { adminPath } from '../../utils/constants';
import deviceSelectors from '../../store/device/selectors';

import userSelectors from '../../store/user/selectors';

interface IProps {
  company: ICompany | undefined;
}

const UserDeviseList = ({ company }: IProps) => {
  const users = userSelectors.usersByCompanyId(company?.id);
  const device = deviceSelectors.deviceByCompanyId(company?.id);

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight: window.innerHeight - 268 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Наименование</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Описание</TableCell>
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
        count={appSystems.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default UserDeviseList;
