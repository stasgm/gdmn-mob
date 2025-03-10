import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { Box, Card, Checkbox, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';

import { ServerLogFile } from '@lib/types';

import { adminPath } from '../../utils/constants';
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';
import { IPageParam } from '../../types';

interface IProps {
  serverLogs: ServerLogFile[];
  selectedServerLogs?: ServerLogFile[];
  limitRows?: number;
  onChangeSelectedDevices?: (newSelectedDeviceIds: any[]) => void;
  onSetPageParams?: (pageParams: IPageParam) => void;
  pageParams?: IPageParam | undefined;
}

const ServerLogListTable = ({
  serverLogs = [],
  onChangeSelectedDevices,
  selectedServerLogs = [],
  limitRows = 0,
  onSetPageParams,
  pageParams,
}: IProps) => {
  const navigate = useNavigate();

  const [selectedServerLogsIds, setSelectedServerLogsIds] = useState<ServerLogFile[]>(selectedServerLogs);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const maxHeight = useWindowResizeMaxHeight();

  const handleSelectAll = (event: any) => {
    let newSelectedServerLogIds;

    if (event.target.checked) {
      newSelectedServerLogIds = serverLogs.map((serverLog: any) => serverLog);
    } else {
      newSelectedServerLogIds = [];
    }

    setSelectedServerLogsIds(newSelectedServerLogIds);
    onChangeSelectedDevices && onChangeSelectedDevices(newSelectedServerLogIds);
  };

  const handleSelectOne = (_event: any, serverLog: ServerLogFile) => {
    const selectedIndex = selectedServerLogsIds.map((item: ServerLogFile) => item.name).indexOf(serverLog.name);

    let newSelectedServerLogIds: ServerLogFile[] = [];

    if (selectedIndex === -1) {
      newSelectedServerLogIds = newSelectedServerLogIds.concat(selectedServerLogsIds, serverLog);
    } else if (selectedIndex === 0) {
      newSelectedServerLogIds = newSelectedServerLogIds.concat(selectedServerLogsIds.slice(1));
    } else if (selectedIndex === selectedServerLogsIds.length - 1) {
      newSelectedServerLogIds = newSelectedServerLogIds.concat(selectedServerLogsIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedServerLogIds = newSelectedServerLogIds.concat(
        selectedServerLogsIds.slice(0, selectedIndex),
        selectedServerLogsIds.slice(selectedIndex + 1),
      );
    }

    setSelectedServerLogsIds(newSelectedServerLogIds);

    onChangeSelectedDevices && onChangeSelectedDevices(newSelectedServerLogIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
    onSetPageParams && onSetPageParams({ ...pageParams, limit: event.target.value });
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
    onSetPageParams && onSetPageParams({ ...pageParams, page: newPage });
  };

  useEffect(() => {
    if (limitRows > 0) {
      setLimit(limitRows);
    }

    if (selectedServerLogsIds.length === 0) {
      if (selectedServerLogs.length > 0) {
        const newSelectedServerLogIds = selectedServerLogs.map((serverLog: ServerLogFile) => serverLog);

        setSelectedServerLogsIds(newSelectedServerLogIds);
      }
    }
  }, [limitRows, selectedServerLogsIds.length, selectedServerLogs]);

  const TableRows = () => {
    const serverLogList = serverLogs.slice(page * limit, page * limit + limit).map((serverLog: ServerLogFile) => {
      return (
        <TableRow
          hover
          key={serverLog.id}
          selected={selectedServerLogsIds.findIndex((d) => d.name === serverLog?.name) !== -1}
          onClick={(event) => {
            event.preventDefault();
            navigate(`${adminPath}/app/serverLogs/${serverLog.id}`);
          }}
          sx={{
            cursor: 'pointer',
          }}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={
                selectedServerLogsIds
                  .map((item: ServerLogFile) => {
                    return item.name;
                  })
                  .indexOf(serverLog.name) !== -1
              }
              onChange={(event) => handleSelectOne(event, serverLog)}
              value="true"
            />
          </TableCell>
          <TableCell>{serverLog.path}</TableCell>
          <TableCell style={{ padding: '0 16px' }}>{serverLog.id}</TableCell>
          <TableCell> {new Date(serverLog.date || '').toLocaleString('ru', { hour12: false })}</TableCell>
          <TableCell> {new Date(serverLog.mdate || '').toLocaleString('ru', { hour12: false })}</TableCell>
          <TableCell> {Math.ceil(serverLog.size).toString()} кб</TableCell>
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, serverLogs.length - page * limit);

    return (
      <>
        {serverLogList}
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedServerLogsIds.length === serverLogs.length}
                    color="primary"
                    indeterminate={selectedServerLogsIds.length > 0 && selectedServerLogsIds.length < serverLogs.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Путь</TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell>Дата редактирования</TableCell>
                <TableCell>Размер</TableCell>
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
        count={serverLogs.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default ServerLogListTable;
