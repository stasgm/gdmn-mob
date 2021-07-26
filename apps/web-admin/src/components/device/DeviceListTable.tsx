import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import PerfectScrollbar from 'react-perfect-scrollbar';

import RefreshIcon from '@material-ui/icons/Refresh';

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
} from '@material-ui/core';

import { IDevice, IActivationCode } from '@lib/types';

// import activationCode from '../../store/activationCode';

import { adminPath } from '../../utils/constants';

interface IProps {
  devices: IDevice[];
  selectedDevices?: IDevice[];
  activationCodes: IActivationCode[];
  limitRows?: number;
  onCreateCode?: (deviceId: string) => void;
  onChangeSelectedDevices?: (newSelectedDeviceIds: any[]) => void;
}

const DeviceListTable = ({
  devices = [],
  activationCodes = [],
  onChangeSelectedDevices,
  selectedDevices = [],
  limitRows = 0,
  onCreateCode,
}: IProps) => {
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<IDevice[]>(selectedDevices);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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

    if (selectedDeviceIds.length === 0) {
      if (selectedDevices.length > 0) {
        const newSelectedDeviceIds = selectedDevices.map((device: IDevice) => device);

        setSelectedDeviceIds(newSelectedDeviceIds);
      }
    }
  }, [limitRows, selectedDeviceIds.length, selectedDevices]);

  const TableRows = () => {
    const deviceList = devices.slice(page * limit, page * limit + limit).map((device: IDevice) => (
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
        <TableCell>{device.uid}</TableCell>
        <TableCell>{device.state}</TableCell>
        <TableCell>{new Date(device.creationDate || '').toLocaleString('en-US', { hour12: false })}</TableCell>
        <TableCell>{new Date(device.editionDate || '').toLocaleString('en-US', { hour12: false })}</TableCell>
        <TableCell>
          <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Box style={{ width: '40px' }}>{activationCodes.find((a) => a.device.id === device.id)?.code}</Box>
            <Box>
              {onCreateCode && (
                <Button
                  // component={RouterLink}
                  onClick={() => onCreateCode(device.id)}
                >
                  <RefreshIcon />
                </Button>
              )}
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    ));

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
        <Box sx={{ minWidth: 1050, p: 1 }}>
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
                <TableCell>Номер</TableCell>
                <TableCell>Состояние</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell>Дата редактирования</TableCell>
                <TableCell>Код активации</TableCell>
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
