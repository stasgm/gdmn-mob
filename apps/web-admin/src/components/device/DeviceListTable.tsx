import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import PerfectScrollbar from 'react-perfect-scrollbar';

import RefreshIcon from '@mui/icons-material/Refresh';

import Tooltip from '@mui/material/Tooltip';

import {
  Box,
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import { IDevice, IActivationCode } from '@lib/types';

import { deviceStates, adminPath } from '../../utils/constants';
import { IPageParam } from '../../types';
import { getMaxHeight } from '../../utils/helpers';
import { setMaxHeight } from '../../utils/hooksMaxHeight';

interface IProps {
  devices: IDevice[];
  selectedDevices?: IDevice[];
  activationCodes: IActivationCode[];
  limitRows?: number;
  onCreateCode?: (deviceId: string) => void;
  onChangeSelectedDevices?: (newSelectedDeviceIds: any[]) => void;
  onCreateUid?: (code: string, deviceId: string) => void;
  onSetPageParams: (pageParams: IPageParam) => void;
  pageParams?: IPageParam | undefined;
}

const DeviceListTable = ({
  devices = [],
  activationCodes = [],
  onChangeSelectedDevices,
  selectedDevices = [],
  limitRows = 0,
  onCreateCode,
  onCreateUid,
  onSetPageParams,
  pageParams,
}: IProps) => {
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<IDevice[]>(selectedDevices);
  const [limit, setLimit] = useState(
    pageParams?.limit && !isNaN(Number(pageParams?.limit)) ? Number(pageParams?.limit) : 10,
  );
  const [page, setPage] = useState(pageParams?.page && !isNaN(Number(pageParams?.page)) ? Number(pageParams.page) : 0);

  const handleSelectAll = (event: any) => {
    let newSelectedDeviceIds;

    if (event.target.checked) {
      newSelectedDeviceIds = devices.map((device: any) => device);
    } else {
      newSelectedDeviceIds = [];
    }

    setSelectedDeviceIds(newSelectedDeviceIds);
    onChangeSelectedDevices && onChangeSelectedDevices(newSelectedDeviceIds);
  };

  const handleSelectOne = (_event: any, device: IDevice) => {
    const selectedIndex = selectedDeviceIds.map((item: IDevice) => item.id).indexOf(device.id);

    let newSelectedDeviceIds: IDevice[] = [];

    if (selectedIndex === -1) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedDeviceIds, device);
    } else if (selectedIndex === 0) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedDeviceIds.slice(1));
    } else if (selectedIndex === selectedDeviceIds.length - 1) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedDeviceIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(
        selectedDeviceIds.slice(0, selectedIndex),
        selectedDeviceIds.slice(selectedIndex + 1),
      );
    }

    setSelectedDeviceIds(newSelectedDeviceIds);

    onChangeSelectedDevices && onChangeSelectedDevices(newSelectedDeviceIds);
  };

  const handleLimitChange = useCallback(
    (event: any) => {
      setLimit(event.target.value);
      onSetPageParams({ ...pageParams, limit: event.target.value });
    },
    [onSetPageParams, pageParams],
  );

  const handlePageChange = useCallback(
    (_event: any, newPage: any) => {
      setPage(newPage);
      onSetPageParams({ ...pageParams, page: newPage });
    },
    [onSetPageParams, pageParams],
  );

  useEffect(() => {
    if (limitRows > 0) {
      setLimit(limitRows);
    }

    if (selectedDeviceIds.length === 0) {
      if (selectedDevices.length > 0) {
        const newSelectedDeviceIds = selectedDevices.map((device: IDevice) => device);

        setSelectedDeviceIds(newSelectedDeviceIds);
      }
    }
  }, [limitRows, selectedDeviceIds.length, selectedDevices]);

  const TableRows = () => {
    const deviceList = devices.slice(page * limit, page * limit + limit).map((device: IDevice) => {
      const code = activationCodes.find((a) => a.device.id === device.id)?.code;

      return (
        <TableRow hover key={device.id} selected={selectedDeviceIds.findIndex((d) => d.id === device?.id) !== -1}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={
                selectedDeviceIds
                  .map((item: IDevice) => {
                    return item.id;
                  })
                  .indexOf(device.id) !== -1
              }
              onChange={(event) => handleSelectOne(event, device)}
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
              <NavLink to={`${adminPath}/app/devices/${device.id}`}>
                <Typography color="textPrimary" variant="body1" key={device.id}>
                  {device.name}
                </Typography>
              </NavLink>
            </Box>
          </TableCell>
          <TableCell style={{ padding: '0 16px' }}>{device.id} </TableCell>
          <TableCell>
            <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Box>
                {onCreateUid && (
                  <Tooltip title="Создать номер">
                    <Button onClick={() => onCreateUid && code && onCreateUid(code, device.id)}>
                      <RefreshIcon />
                    </Button>
                  </Tooltip>
                )}
              </Box>
              <Box>{device.uid}</Box>
            </Box>
          </TableCell>
          <TableCell>{deviceStates[device.state]}</TableCell>
          <TableCell>
            <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Box style={{ width: '40px' }}>{code}</Box>
              <Box>
                {onCreateCode && (
                  <Tooltip title="Создать код">
                    <Button onClick={() => onCreateCode(device.id)}>
                      <RefreshIcon />
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </TableCell>
          <TableCell>{device.company?.name || ''}</TableCell>

          <TableCell>{new Date(device.creationDate || '').toLocaleString('ru', { hour12: false })}</TableCell>
          <TableCell>{new Date(device.editionDate || '').toLocaleString('ru', { hour12: false })}</TableCell>
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, devices.length - page * limit);

    return (
      <>
        {deviceList}
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
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight: setMaxHeight(getMaxHeight()) }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedDeviceIds.length === devices.length}
                    color="primary"
                    indeterminate={selectedDeviceIds.length > 0 && selectedDeviceIds.length < devices.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Номер</TableCell>
                <TableCell>Состояние</TableCell>
                <TableCell>Код активации</TableCell>
                <TableCell>Компания</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell>Дата редактирования</TableCell>
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
        count={devices.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default DeviceListTable;
