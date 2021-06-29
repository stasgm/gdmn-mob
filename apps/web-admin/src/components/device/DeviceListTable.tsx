import { useState } from 'react';
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
import { IDevice } from '@lib/types';

interface props {
  devices?: IDevice[];
}

const DeviceListTable = ({ devices = [], ...rest }: props) => {
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<any>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event: any) => {
    let newSelectedDeviceIds;

    if (event.target.checked) {
      newSelectedDeviceIds = devices.map((device: any) => device.id);
    } else {
      newSelectedDeviceIds = [];
    }

    setSelectedDeviceIds(newSelectedDeviceIds);
  };

  const handleSelectOne = (_event: any, id: any) => {
    const selectedIndex = selectedDeviceIds.indexOf(id);
    let newSelectedDeviceIds: any = [];

    if (selectedIndex === -1) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedDeviceIds, id);
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
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  const TableRows = () => {
    const deviceList = devices.slice(page * limit, page * limit + limit).map((device: IDevice) => (
      <TableRow hover key={device.id} selected={selectedDeviceIds.indexOf(device.id) !== -1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedDeviceIds.indexOf(device.id) !== -1}
            onChange={(event) => handleSelectOne(event, device.id)}
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
            <NavLink to={`/app/devices/${device.id}`}>
              <Typography color="textPrimary" variant="body1" key={device.id}>
                {device.name}
              </Typography>
            </NavLink>
          </Box>
        </TableCell>
        {/* <TableCell>{device.name}</TableCell> */}
        <TableCell>{device.uid}</TableCell>
        <TableCell>{device.state}</TableCell>
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
    <Card {...rest}>
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
