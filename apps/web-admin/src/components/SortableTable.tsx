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
  TableSortLabel,
  Typography,
} from '@material-ui/core';

import { IHeadCells } from '../types';
import { adminPath } from '../utils/constants';
import { isNamedEntity } from '../utils/helpers';

type Order = 'asc' | 'desc';

interface props<T extends { id: string }> {
  headCells: IHeadCells<T>[];
  data: T[];
}

function SortableTable<T extends { id: string }>({ data = [], headCells = [], ...rest }: props<T>) {
  const [selectedUserIds, setSelectedUserIds] = useState<any>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(headCells[0].id);

  const handleSelectAll = (event: any) => {
    let newSelectedUserIds;

    if (event.target.checked) {
      newSelectedUserIds = data.map((user: any) => user.id);
    } else {
      newSelectedUserIds = [];
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  console.log('SortableTable data', data);

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

  const handleSortRequest = (cellId: keyof T) => {
    const isAsc = orderBy === cellId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(cellId);
  };

  function descendingComparator<T>(a: T, b: T, o: keyof T) {
    if (b[o] < a[o]) {
      return -1;
    }
    if (b[o] > a[o]) {
      return 1;
    }
    return 0;
  }

  function comporator<T>(a: T, b: T, ord: keyof T) {
    return order === 'desc' ? descendingComparator(a, b, ord) : -descendingComparator(a, b, ord);
  }

  function SortedTableRows<T>(array: T[]) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comporator<T>(a[0], b[0], orderBy as keyof T);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const TableRows = () => {
    const userList = SortedTableRows<T>(data)
      .slice(page * limit, page * limit + limit)
      .map((item: T) => (
        <TableRow hover key={item.id} selected={selectedUserIds.indexOf(item.id) !== -1}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedUserIds.indexOf(item.id) !== -1}
              onChange={(event) => handleSelectOne(event, item.id)}
              value="true"
            />
          </TableCell>

          {headCells.map((headCell, index) => {
            const v = item[headCell.id];
            const s = isNamedEntity(v) ? v.name : v;

            return index ? (
              <TableCell key={index}>{s}</TableCell>
            ) : (
              <TableCell key={index} style={{ padding: '0 16px' }}>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <NavLink to={`${adminPath}/app/users/${item.id}`}>
                    <Typography color="textPrimary" variant="body1" key={item.id}>
                      {s}
                    </Typography>
                  </NavLink>
                </Box>
              </TableCell>
            );
          })}
        </TableRow>
      ));

    const emptyRows = limit - Math.min(limit, data.length - page * limit);

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
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050, p: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUserIds.length === data.length}
                    color="primary"
                    indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id as string} sortDirection={orderBy === headCell.id ? order : false}>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleSortRequest(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
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
        count={data.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

export default SortableTable;
