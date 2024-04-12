import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DeviceState } from '@lib/types';

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
} from '@mui/material';

import { IHeadCells, IPageParam } from '../types';
import { deviceStates, adminPath } from '../utils/constants';
import { useWindowResizeMaxHeight } from '../utils/useWindowResizeMaxHeight';

type Order = 'asc' | 'desc';

const rowStyle = { height: 53 };

interface IProps<T extends { id: string }> {
  headCells: IHeadCells<T>[];
  data: T[];
  path?: string;
  endPath?: string;
  onSetPageParams?: (pageParams: IPageParam) => void;
  pageParams?: IPageParam | undefined;
  byMaxHeight?: boolean;
  minusHeight?: number;
}

function SortableTable<T extends { id: string }>({
  data = [],
  headCells = [],
  path,
  endPath,
  onSetPageParams,
  pageParams,
  byMaxHeight = false,
  minusHeight = 0,
  ...rest
}: IProps<T>) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [limit, setLimit] = useState(pageParams?.limit || 10);
  const [page, setPage] = useState(pageParams?.page || 0);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>();
  const maxHeight = useWindowResizeMaxHeight();

  const handleSelectAll = (event: any) => {
    let newSelectedItemIds;

    if (event.target.checked) {
      newSelectedItemIds = data.map((item: any) => item.id);
    } else {
      newSelectedItemIds = [];
    }

    setSelectedItemIds(newSelectedItemIds);
  };

  const handleSelectOne = (_event: any, id: any) => {
    const isSelected = selectedItemIds.findIndex((selId) => selId === id) !== -1;
    let newSelectedItemIds: string[] = [];

    if (!isSelected) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedItemIds, id);
    } else {
      newSelectedItemIds = newSelectedItemIds.filter((selectedId) => selectedId !== id);
    }

    setSelectedItemIds(newSelectedItemIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
    onSetPageParams && onSetPageParams({ ...pageParams, limit: event.target.value });
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
    onSetPageParams && onSetPageParams({ ...pageParams, page: newPage });
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

  function DeserializeProp<T>(propName: keyof T, value: any) {
    /** Если в наименовании содержится цифра, то значение преобразоывается в дату */
    if (propName === 'name') return value;

    if (!isNaN(new Date(value).getDate())) {
      return new Date(value || '').toLocaleString('ru', { hour12: false });
    }

    if (propName === 'state') {
      return deviceStates[value as DeviceState];
    } // для поля Состояние в устройстве

    if (typeof value === 'object' && 'name' in value) {
      return value.name;
    }

    return value;
  }

  const end = endPath ? `/${endPath}/` : '';

  const TableRows = () => {
    const itemList = SortedTableRows<T>(data)
      .slice(page * limit, page * limit + limit)
      .map((item: T) => (
        <TableRow sx={rowStyle} hover key={item.id} selected={selectedItemIds.indexOf(item.id) !== -1}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedItemIds.indexOf(item.id) !== -1}
              onChange={(event) => handleSelectOne(event, item.id)}
              value="true"
            />
          </TableCell>

          {headCells.map((headCell, index) => {
            return index ? (
              <TableCell key={index}>{DeserializeProp<T>(headCell.id, item[headCell.id])}</TableCell>
            ) : (
              <TableCell key={index} style={{ padding: '0 16px' }}>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  {path ? (
                    <NavLink to={`${adminPath}${path}${item.id}${end}`}>
                      <Typography color="textPrimary" variant="body1" key={item.id}>
                        {DeserializeProp<T>(headCell.id, item[headCell.id])}
                      </Typography>
                    </NavLink>
                  ) : (
                    <Typography color="textPrimary" variant="body1" key={item.id}>
                      {DeserializeProp<T>(headCell.id, item[headCell.id])}
                    </Typography>
                  )}
                </Box>
              </TableCell>
            );
          })}
        </TableRow>
      ));

    const emptyRows = limit - Math.min(limit, data.length - page * limit);

    return (
      <>
        {itemList}
        {emptyRows > 0 && page > 0 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={4} />
          </TableRow>
        )}
      </>
    );
  };

  const tableStyle = {
    p: 1,
    overflowX: 'auto',
    ...(byMaxHeight ? { overflowY: 'auto', maxHeight: maxHeight - minusHeight } : {}),
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={tableStyle}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedItemIds.length === data.length}
                    color="primary"
                    indeterminate={selectedItemIds.length > 0 && selectedItemIds.length < data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id as string} sortDirection={orderBy === headCell.id ? order : false}>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={headCell.sortEnable ? () => handleSortRequest(headCell.id) : undefined}
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
        labelRowsPerPage="Строк на странице"
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
