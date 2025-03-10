import { useState, useEffect } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { Box, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { IDeviceLogEntry } from '@lib/types';

import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

interface IProps {
  deviceLog: IDeviceLogEntry[];
  limitRows?: number;
}

const DeviceLogTable = ({ deviceLog = [], limitRows = 0 }: IProps) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const maxHeight = useWindowResizeMaxHeight();

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
    const deviceLogList = deviceLog.slice(page * limit, page * limit + limit).map((log: IDeviceLogEntry) => {
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
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight }}>
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
