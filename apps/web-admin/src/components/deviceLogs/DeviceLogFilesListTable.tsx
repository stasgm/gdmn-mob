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

import { IDeviceLogFiles } from '@lib/types';

import { adminPath } from '../../utils/constants';

interface IProps {
  deviceLogFiles: IDeviceLogFiles[];
  selectedDeviceLogFiles?: IDeviceLogFiles[];
  limitRows?: number;
  onChangeSelectedDeviceLogFiles?: (newSelectedDeviceIds: any[]) => void;
}

const DeviceLogFilesListTable = ({
  deviceLogFiles = [],
  onChangeSelectedDeviceLogFiles,
  selectedDeviceLogFiles = [],
  limitRows = 0,
}: IProps) => {
  const [selectedDeviceLogFileIds, setSelectedDeviceLogFileIds] = useState<IDeviceLogFiles[]>(selectedDeviceLogFiles);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event: any) => {
    let newSelectedDeviceLogFileIds;

    if (event.target.checked) {
      newSelectedDeviceLogFileIds = deviceLogFiles.map((deviceLogFile: any) => deviceLogFile);
    } else {
      newSelectedDeviceLogFileIds = [];
    }

    setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);
    onChangeSelectedDeviceLogFiles && onChangeSelectedDeviceLogFiles(newSelectedDeviceLogFileIds);
  };

  const handleSelectOne = (_event: any, deviceLogFile: IDeviceLogFiles) => {
    const selectedIndex = selectedDeviceLogFileIds.map((item: IDeviceLogFiles) => item.id).indexOf(deviceLogFile.id);

    let newSelectedDeviceLogFileIds: IDeviceLogFiles[] = [];

    if (selectedIndex === -1) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(selectedDeviceLogFileIds, deviceLogFile);
    } else if (selectedIndex === 0) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(selectedDeviceLogFileIds.slice(1));
    } else if (selectedIndex === selectedDeviceLogFileIds.length - 1) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(selectedDeviceLogFileIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(
        selectedDeviceLogFileIds.slice(0, selectedIndex),
        selectedDeviceLogFileIds.slice(selectedIndex + 1),
      );
    }

    setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);

    onChangeSelectedDeviceLogFiles && onChangeSelectedDeviceLogFiles(newSelectedDeviceLogFileIds);
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

    if (selectedDeviceLogFileIds.length === 0) {
      if (selectedDeviceLogFiles.length > 0) {
        const newSelectedDeviceLogFileIds = selectedDeviceLogFiles.map(
          (deviceLogFile: IDeviceLogFiles) => deviceLogFile,
        );

        setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);
      }
    }
  }, [limitRows, selectedDeviceLogFileIds.length, selectedDeviceLogFiles]);

  const TableRows = () => {
    const deviceLogFileList = deviceLogFiles
      .slice(page * limit, page * limit + limit)
      .map((deviceLogFile: IDeviceLogFiles) => {
        return (
          <TableRow
            hover
            key={deviceLogFile.id}
            selected={selectedDeviceLogFileIds.findIndex((d) => d.id === deviceLogFile?.id) !== -1}
          >
            <TableCell padding="checkbox">
              <Checkbox
                checked={
                  selectedDeviceLogFileIds
                    .map((item: IDeviceLogFiles) => {
                      return item.id;
                    })
                    .indexOf(deviceLogFile.id) !== -1
                }
                onChange={(event) => handleSelectOne(event, deviceLogFile)}
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
                <NavLink to={`${adminPath}/app/deviceLogs/${deviceLogFile.id}`}>
                  <Typography color="textPrimary" variant="body1" key={deviceLogFile.id}>
                    {deviceLogFile.path}
                  </Typography>
                </NavLink>
              </Box>
            </TableCell>
            <TableCell>{deviceLogFile.company.name}</TableCell>
            <TableCell>{deviceLogFile.appSystem.name}</TableCell>
            <TableCell>{deviceLogFile.contact.name}</TableCell>
            {/* <TableCell>{message.producer.name}</TableCell>
          <TableCell>{message.consumer.name}</TableCell> */}
            <TableCell>{deviceLogFile.device.name}</TableCell>
            <TableCell>{deviceLogFile.device.id}</TableCell>
            <TableCell>{new Date(deviceLogFile.date || '').toLocaleString('ru', { hour12: false })}</TableCell>
            {/* <TableCell>{message.size} кб</TableCell> */}
            <TableCell>{Math.ceil(deviceLogFile.size).toString()} кб</TableCell>
          </TableRow>
        );
      });

    const emptyRows = limit - Math.min(limit, deviceLogFiles.length - page * limit);

    return (
      <>
        {deviceLogFileList}
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
                    checked={selectedDeviceLogFileIds.length === deviceLogFiles.length}
                    color="primary"
                    indeterminate={
                      selectedDeviceLogFileIds.length > 0 && selectedDeviceLogFileIds.length < deviceLogFiles.length
                    }
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
                <TableCell>Идентификатор</TableCell>
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
        count={deviceLogFiles.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default DeviceLogFilesListTable;
