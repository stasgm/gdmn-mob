import { useState, useEffect } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { Box, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { IDeviceLog } from '@lib/types';

import { getMaxHeight } from '../../utils/helpers';
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

interface IProps {
  deviceLog: IDeviceLog[];
  limitRows?: number;
}

const DeviceLogTable = ({ deviceLog = [], limitRows = 0 }: IProps) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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
  }, [limitRows]);

  const TableRows = () => {
    const deviceLogList = deviceLog.slice(page * limit, page * limit + limit).map((log: IDeviceLog) => {
      return (
        <TableRow hover key={log.id}>
          <TableCell>{log.name}</TableCell>
          <TableCell>{log.message}</TableCell>
          <TableCell>{new Date(log.date).toLocaleString('ru', { hour12: false })}</TableCell>
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, deviceLog.length - page * limit);

    return (
      <>
        {deviceLogList}
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
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight: useWindowResizeMaxHeight(getMaxHeight()) }}>
          <Table>
            <TableHead>
              <TableRow>
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
        count={deviceLog.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default DeviceLogTable;
