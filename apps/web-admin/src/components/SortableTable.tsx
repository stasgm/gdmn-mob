import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  withCheckBox?: boolean;
}

const descendingComparator = <T,>(a: any, b: any, o: keyof T) => {
  const valueA = a[o] ? (typeof a[o] === 'object' && 'name' in a[o] ? a[o].name : a[o]) : '';
  const valueB = b[o] ? (typeof b[o] === 'object' && 'name' in b[o] ? b[o].name : b[o]) : '';

  if (valueB < valueA) {
    return -1;
  }
  if (valueB > valueA) {
    return 1;
  }
  return 0;
};

const DeserializeProp = <T,>(propName: keyof T, value: any) => {
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
};

function SortableTable<T extends { id: string }>({
  data = [],
  headCells = [],
  path,
  endPath,
  onSetPageParams,
  pageParams,
  byMaxHeight = false,
  minusHeight = 0,
  withCheckBox = false,
  ...rest
}: IProps<T>) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [limit, setLimit] = useState(pageParams?.limit || 10);
  const [page, setPage] = useState(pageParams?.page || 0);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>();
  const maxHeight = useWindowResizeMaxHeight();

  const navigate = useNavigate();

  const handleSelectAll = useCallback(
    (event: any) => {
      let newSelectedItemIds;

      if (event.target.checked) {
        newSelectedItemIds = data.map((item: any) => item.id);
      } else {
        newSelectedItemIds = [];
      }

      setSelectedItemIds(newSelectedItemIds);
    },
    [data],
  );

  const handleSelectOne = useCallback(
    (e: any, id: any) => {
      const isSelected = selectedItemIds.findIndex((selId) => selId === id) !== -1;
      let newSelectedItemIds: string[] = [];

      if (!isSelected) {
        newSelectedItemIds = newSelectedItemIds.concat(selectedItemIds, id);
      } else {
        newSelectedItemIds = newSelectedItemIds.filter((selectedId) => selectedId !== id);
      }

      setSelectedItemIds(newSelectedItemIds);
    },
    [selectedItemIds],
  );

  const handleLimitChange = useCallback(
    (event: any) => {
      setLimit(event.target.value);
      onSetPageParams && onSetPageParams({ ...pageParams, limit: event.target.value });
    },
    [onSetPageParams, pageParams],
  );

  const handlePageChange = useCallback(
    (_event: any, newPage: any) => {
      setPage(newPage);
      onSetPageParams && onSetPageParams({ ...pageParams, page: newPage });
    },
    [onSetPageParams, pageParams],
  );

  const handleSortRequest = useCallback(
    (cellId: keyof T) => {
      const isAsc = orderBy === cellId && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(cellId);
    },
    [order, orderBy],
  );

  const comporator = useCallback(
    (a: T, b: T, ord: keyof T) => {
      const compared = descendingComparator(a, b, ord);
      return order === 'desc' ? compared : -compared;
    },
    [order],
  );

  const sortedTableRows = useMemo(() => {
    const stabilizedThis = data.map((el, index) => [el, index] as unknown as [T, number]);

    stabilizedThis.sort((a, b) => {
      const isOrder = comporator(a[0], b[0], orderBy as keyof T);
      if (isOrder !== 0) return isOrder;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }, [comporator, data, orderBy]);

  const end = endPath ? `/${endPath}/` : '';

  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>, id: string) => {
      if (!window.getSelection()?.toString()) {
        navigate(`${adminPath}${path}${id}${end}`);
      }
    },
    [navigate, path, end],
  );

  const TableRows = useMemo(() => {
    const itemList = sortedTableRows.slice(page * limit, page * limit + limit).map((item: T) => (
      <TableRow
        sx={rowStyle}
        hover
        key={item.id}
        selected={selectedItemIds.indexOf(item.id) !== -1}
        onClick={(e) => path && handleRowClick(e, item.id)}
        style={{ cursor: path ? 'pointer' : '' }}
      >
        {withCheckBox && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedItemIds.indexOf(item.id) !== -1}
              onChange={(event) => handleSelectOne(event, item.id)}
              value="true"
              onClick={(event) => event.stopPropagation()}
            />
          </TableCell>
        )}
        {headCells.map((headCell, index) => {
          return <TableCell key={index}>{DeserializeProp<T>(headCell.id, item[headCell.id])}</TableCell>;
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
  }, [
    sortedTableRows,
    page,
    limit,
    data.length,
    selectedItemIds,
    path,
    withCheckBox,
    headCells,
    handleRowClick,
    handleSelectOne,
  ]);

  const tableStyle = useMemo(
    () => ({
      p: 1,
      overflowX: 'auto',
      ...(byMaxHeight ? { overflowY: 'auto', maxHeight: maxHeight - minusHeight } : {}),
    }),
    [byMaxHeight, maxHeight, minusHeight],
  );

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={tableStyle}>
          <Table sx={{ '& .MuiTableCell-root': { width: 'auto', whiteSpace: 'nowrap', userSelect: 'text' } }}>
            <TableHead>
              <TableRow>
                {withCheckBox && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItemIds.length === data.length}
                      color="primary"
                      indeterminate={selectedItemIds.length > 0 && selectedItemIds.length < data.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}

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
            <TableBody>{TableRows}</TableBody>
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
