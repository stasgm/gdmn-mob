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
import { deviceLogFiles } from '../../types';

interface IProps {
  messages: deviceLogFiles[];
  selectedMessages?: deviceLogFiles[];
  limitRows?: number;
  onChangeSelectedMessages?: (newSelectedDeviceIds: any[]) => void;
}

const DeviceLogsListTable = ({
  messages = [],
  onChangeSelectedMessages,
  selectedMessages = [],
  limitRows = 0,
}: IProps) => {
  const [selectedMessageIds, setSelectedMessageIds] = useState<deviceLogFiles[]>(selectedMessages);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event: any) => {
    let newSelectedMessageIds;

    if (event.target.checked) {
      newSelectedMessageIds = messages.map((message: any) => message);
    } else {
      newSelectedMessageIds = [];
    }

    setSelectedMessageIds(newSelectedMessageIds);
    onChangeSelectedMessages && onChangeSelectedMessages(newSelectedMessageIds);
  };

  const handleSelectOne = (_event: any, message: deviceLogFiles) => {
    const selectedIndex = selectedMessageIds.map((item: deviceLogFiles) => item.id).indexOf(message.id);

    let newSelectedMessageIds: deviceLogFiles[] = [];

    if (selectedIndex === -1) {
      newSelectedMessageIds = newSelectedMessageIds.concat(selectedMessageIds, message);
    } else if (selectedIndex === 0) {
      newSelectedMessageIds = newSelectedMessageIds.concat(selectedMessageIds.slice(1));
    } else if (selectedIndex === selectedMessageIds.length - 1) {
      newSelectedMessageIds = newSelectedMessageIds.concat(selectedMessageIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedMessageIds = newSelectedMessageIds.concat(
        selectedMessageIds.slice(0, selectedIndex),
        selectedMessageIds.slice(selectedIndex + 1),
      );
    }

    setSelectedMessageIds(newSelectedMessageIds);

    onChangeSelectedMessages && onChangeSelectedMessages(newSelectedMessageIds);
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

    if (selectedMessageIds.length === 0) {
      if (selectedMessages.length > 0) {
        const newSelectedMessageIds = selectedMessages.map((message: deviceLogFiles) => message);

        setSelectedMessageIds(newSelectedMessageIds);
      }
    }
  }, [limitRows, selectedMessageIds.length, selectedMessages]);

  const TableRows = () => {
    const messageList = messages.slice(page * limit, page * limit + limit).map((message: deviceLogFiles) => {
      return (
        <TableRow hover key={message.id} selected={selectedMessageIds.findIndex((d) => d.id === message?.id) !== -1}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={
                selectedMessageIds
                  .map((item: deviceLogFiles) => {
                    return item.id;
                  })
                  .indexOf(message.id) !== -1
              }
              onChange={(event) => handleSelectOne(event, message)}
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
              <NavLink to={`${adminPath}/app/messages/${message.id}`}>
                <Typography color="textPrimary" variant="body1" key={message.id}>
                  {message.path}
                </Typography>
              </NavLink>
            </Box>
          </TableCell>
          <TableCell>{message.company.name}</TableCell>
          <TableCell>{message.appSystem.name}</TableCell>
          <TableCell>{message.appSystem.name}</TableCell>
          {/* <TableCell>{message.producer.name}</TableCell>
          <TableCell>{message.consumer.name}</TableCell> */}
          <TableCell>{message.device.name}</TableCell>
          <TableCell>{new Date(message.date || '').toLocaleString('ru', { hour12: false })}</TableCell>
          <TableCell>{message.size} мб</TableCell>
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, messages.length - page * limit);

    return (
      <>
        {messageList}
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
        <Box sx={{ p: 1, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedMessageIds.length === messages.length}
                    color="primary"
                    indeterminate={selectedMessageIds.length > 0 && selectedMessageIds.length < messages.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Компания</TableCell>
                <TableCell>Подсистема</TableCell>
                <TableCell>Пользователь</TableCell>
                {/* <TableCell>Отправитель</TableCell>
                <TableCell>Получатель</TableCell> */}
                <TableCell>Устройство</TableCell>
                <TableCell>Дата</TableCell>
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
        count={messages.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default DeviceLogsListTable;
