import { useState, useEffect } from 'react';

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

import { IErrorNotice } from '../../types';

interface IProps {
  errors?: IErrorNotice[];
  selectedErrors?: IErrorNotice[];
  limitRows?: number;
  onChangeSelectedErrors?: (newSelectedErrorIds: any[]) => void;
}

const DeviceBindingLogTable = ({ errors = [], onChangeSelectedErrors, selectedErrors = [], limitRows = 0 }: IProps) => {
  const [selectedErrorIds, setSelectedErrorIds] = useState<IErrorNotice[]>(selectedErrors);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event: any) => {
    let newSelectedErrorIds;

    if (event.target.checked) {
      newSelectedErrorIds = errors.map((error: any) => error);
    } else {
      newSelectedErrorIds = [];
    }

    setSelectedErrorIds(newSelectedErrorIds);
    onChangeSelectedErrors && onChangeSelectedErrors(newSelectedErrorIds);
  };

  const handleSelectOne = (_event: any, error: IErrorNotice) => {
    const selectedIndex = selectedErrorIds.map((item: IErrorNotice) => item.id).indexOf(error.id);

    let newSelectedDeviceIds: IErrorNotice[] = [];

    if (selectedIndex === -1) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedErrorIds, error);
    } else if (selectedIndex === 0) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedErrorIds.slice(1));
    } else if (selectedIndex === selectedErrorIds.length - 1) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedErrorIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(
        selectedErrorIds.slice(0, selectedIndex),
        selectedErrorIds.slice(selectedIndex + 1),
      );
    }

    setSelectedErrorIds(newSelectedDeviceIds);

    onChangeSelectedErrors && onChangeSelectedErrors(newSelectedDeviceIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (limitRows > 0) {
      setLimit(limitRows);
    }

    if (selectedErrorIds.length === 0) {
      if (selectedErrors.length > 0) {
        const newSelectedDeviceIds = selectedErrors.map((error: IErrorNotice) => error);

        setSelectedErrorIds(newSelectedDeviceIds);
      }
    }
  }, [limitRows, selectedErrorIds.length, selectedErrors]);

  const TableRows = () => {
    const errorList = errors.slice(page * limit, page * limit + limit).map((error: IErrorNotice) => {
      return (
        <TableRow
          hover
          key={error.id}
          selected={
            selectedErrorIds
              .map((item: IErrorNotice) => {
                return item.id;
              })
              .indexOf(error.id) !== -1
          }
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={
                selectedErrorIds
                  .map((item: IErrorNotice) => {
                    return item.id;
                  })
                  .indexOf(error.id) !== -1
              }
              onChange={(event) => handleSelectOne(event, error)}
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
              <Typography color="textPrimary" variant="body1" key={error.id}>
                {error.name}
              </Typography>
            </Box>
          </TableCell>

          <TableCell>{error.message}</TableCell>

          <TableCell>{new Date(error.date || '').toLocaleString('ru', { hour12: false })}</TableCell>
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, errors.length - page * limit);

    return (
      <>
        {errorList}
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
                    checked={selectedErrorIds.length === errors.length}
                    color="primary"
                    indeterminate={selectedErrorIds.length > 0 && selectedErrorIds.length < errors.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Функция</TableCell>
                <TableCell>Сообщение</TableCell>
                <TableCell>Дата</TableCell>
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
        count={errors.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default DeviceBindingLogTable;
