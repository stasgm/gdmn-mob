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
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { IHeadCells } from '../types';
import { deviceStates, adminPath } from '../utils/constants';

type Order = 'asc' | 'desc';

const useStyles = makeStyles(() => ({
  row: { height: 53 },
}));

interface IProps<T extends { id: string }> {
  headCells: IHeadCells<T>[];
  data: T[];
  path: string;
  isFiltered: boolean;
}

function SortableTable<T extends { id: string }>({
  data = [],
  headCells = [],
  path,
  isFiltered = false,
  ...rest
}: IProps<T>) {
  const [selectedItemIds, setSelectedItemIds] = useState<any>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(); //headCells[0].id
  const classes = useStyles();

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
    const selectedIndex = selectedItemIds.indexOf(id);
    let newSelectedItemIds: any = [];

    if (selectedIndex === -1) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedItemIds, id);
    } else if (selectedIndex === 0) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedItemIds.slice(1));
    } else if (selectedIndex === selectedItemIds.length - 1) {
      newSelectedItemIds = newSelectedItemIds.concat(selectedItemIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedItemIds = newSelectedItemIds.concat(
        selectedItemIds.slice(0, selectedIndex),
        selectedItemIds.slice(selectedIndex + 1),
      );
    }

    setSelectedItemIds(newSelectedItemIds);
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

  const TableRows = () => {
    const itemList = SortedTableRows<T>(data)
      .slice(page * limit, page * limit + limit)
      .map((item: T) => (
        <TableRow className={classes.row} hover key={item.id} selected={selectedItemIds.indexOf(item.id) !== -1}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedItemIds.indexOf(item.id) !== -1}
              onChange={(event) => handleSelectOne(event, item.id)}
              value="true"
            />
          </TableCell>

          {headCells.map((headCell, index) => {
            return index ? (
              <TableCell key={index}>{DeserializeProp<T>(headCell.id, item[headCell.id])} 123</TableCell>
            ) : (
              <TableCell key={index} style={{ padding: '0 16px' }}>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <NavLink to={`${adminPath}${path}${item.id}`}>
                    <Typography color="textPrimary" variant="body1" key={item.id}>
                      {DeserializeProp<T>(headCell.id, item[headCell.id])}
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
        {itemList}
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
        <Box sx={{ p: 1, overflowX: 'auto' }}>
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

              {/* // <TableRow>
                //   <TableCell padding="checkbox">
                //     <Checkbox
                //       checked={selectedItemIds.length === data.length}
                //       color="primary"
                //       indeterminate={selectedItemIds.length > 0 && selectedItemIds.length < data.length}
                //       onChange={handleSelectAll}
                //     />
                //   </TableCell>
                //   {headCells.map((headCell) => (
                //     <TableCell key={headCell.id as string} sortDirection={orderBy === headCell.id ? order : false}>
                //       <TableSortLabel
                //         active={orderBy === headCell.id}
                //         direction={orderBy === headCell.id ? order : 'asc'}
                //         onClick={headCell.sortEnable ? () => handleSortRequest(headCell.id) : undefined}
                //       >
                //         {/* {headCell.label} */}
              {/* //         123456
                //       </TableSortLabel>
                //     </TableCell>
                //   ))}
                // </TableRow> */}
              {isFiltered ? (
                <TableRow>
                  <TableCell></TableCell>
                  {headCells.map((i) => (
                    <TableCell key={i.id as string}>
                      {i.filterEnable ? (
                        <TextField
                          InputProps={{
                            sx: {
                              height: 30,
                              // maxWidth: 100,
                              fontSize: 13,
                              '& .MuiOutlinedInput-input': {
                                borderWidth: 0,
                                padding: 0.5,
                              },
                            },
                          }}
                          // sx={{ maxWidth: 100 }}
                          fullWidth
                          name="path"
                          required
                          variant="outlined"
                          type="search"
                          // value={formik.values.path}
                          // onChange={formik.handleChange}
                        />
                      ) : null}
                    </TableCell>
                  ))}
                  {/* <TableCell></TableCell>
                  <TableCell>
                    {isFilterVisible ? (
                      <TextField
                        InputProps={{
                          sx: {
                            height: 30,
                            // maxWidth: 100,
                            fontSize: 13,
                            '& .MuiOutlinedInput-input': {
                              borderWidth: 0,
                              padding: 0.5,
                            },
                          },
                        }}
                        // sx={{ maxWidth: 100 }}
                        fullWidth
                        name="path"
                        required
                        variant="outlined"
                        type="search"
                        // value={formik.values.path}
                        // onChange={formik.handleChange}
                      />
                    ) : null}
                  </TableCell> */}
                </TableRow>
              ) : null}
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
