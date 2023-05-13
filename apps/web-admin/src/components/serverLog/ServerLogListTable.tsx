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
} from '@material-ui/core';

import { adminPath } from '../../utils/constants';
import { IServerLog } from '../../types';

interface IProps {
  serverLogs: IServerLog[];
  selectedServerLogs?: IServerLog[];
  limitRows?: number;
  onChangeSelectedDevices?: (newSelectedDeviceIds: any[]) => void;
}

const ServerLogListTable = ({
  serverLogs = [],
  onChangeSelectedDevices,
  selectedServerLogs = [],
  limitRows = 0,
}: IProps) => {
  const [selectedServerLogsIds, setSelectedServerLogsIds] = useState<IServerLog[]>(selectedServerLogs);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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

  const handleSelectOne = (_event: any, serverLog: IServerLog) => {
    const selectedIndex = selectedServerLogsIds.map((item: IServerLog) => item.name).indexOf(serverLog.name);

    let newSelectedServerLogIds: IServerLog[] = [];

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
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (limitRows > 0) {
      setLimit(limitRows);
    }

    if (selectedServerLogsIds.length === 0) {
      if (selectedServerLogs.length > 0) {
        const newSelectedServerLogIds = selectedServerLogs.map((serverLog: IServerLog) => serverLog);

        setSelectedServerLogsIds(newSelectedServerLogIds);
      }
    }
  }, [limitRows, selectedServerLogsIds.length, selectedServerLogs]);

  const TableRows = () => {
    const serverLogList = serverLogs.slice(page * limit, page * limit + limit).map((serverLog: IServerLog) => {
      return (
        <TableRow
          hover
          key={serverLog.name}
          selected={selectedServerLogsIds.findIndex((d) => d.name === serverLog?.name) !== -1}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={
                selectedServerLogsIds
                  .map((item: IServerLog) => {
                    return item.name;
                  })
                  .indexOf(serverLog.name) !== -1
              }
              onChange={(event) => handleSelectOne(event, serverLog)}
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
              <NavLink to={`${adminPath}/app/serverLogs/${serverLog.name}`}>
                <Typography color="textPrimary" variant="body1" key={serverLog.name}>
                  {serverLog.name}
                </Typography>
              </NavLink>
            </Box>
          </TableCell>
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
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight: window.innerHeight - 268 }}>
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
                <TableCell>Название</TableCell>
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
