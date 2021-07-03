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
import { IDeviceBinding } from '@lib/types';
import { deviceStates } from '../../utils/constants';

interface IProps {
  deviceBindings?: IDeviceBinding[];
  selectedDevices?: IDeviceBinding[];
  limitRows?: number;
  onChangeSelectedDevices?: (newSelectedDeviceIds: any[]) => void;
}

const DeviceBindingListTable = ({
  deviceBindings = [],
  onChangeSelectedDevices,
  selectedDevices = [],
  limitRows = 0,
}: IProps) => {
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<IDeviceBinding[]>(selectedDevices);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event: any) => {
    let newSelectedDeviceIds;

    if (event.target.checked) {
      newSelectedDeviceIds = deviceBindings.map((binding: any) => binding);
    } else {
      newSelectedDeviceIds = [];
    }

    setSelectedDeviceIds(newSelectedDeviceIds);
    onChangeSelectedDevices && onChangeSelectedDevices(newSelectedDeviceIds);
  };

  const handleSelectOne = (_event: any, binding: IDeviceBinding) => {
    const selectedIndex = selectedDeviceIds.map((item: IDeviceBinding) => item.id).indexOf(binding.id);

    let newSelectedDeviceIds: IDeviceBinding[] = [];

    if (selectedIndex === -1) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedDeviceIds, binding);
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
        const newSelectedDeviceIds = selectedDevices.map((binding: IDeviceBinding) => binding);

        setSelectedDeviceIds(newSelectedDeviceIds);
      }
    }
  }, [limitRows, selectedDeviceIds.length, selectedDevices]);

  const TableRows = () => {
    const deviceList = deviceBindings.slice(page * limit, page * limit + limit).map((binding: IDeviceBinding) => (
      <TableRow
        hover
        key={binding.id}
        selected={
          selectedDeviceIds
            .map((item: IDeviceBinding) => {
              return item.id;
            })
            .indexOf(binding.id) !== -1
        }
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={
              selectedDeviceIds
                .map((item: IDeviceBinding) => {
                  return item.id;
                })
                .indexOf(binding.id) !== -1
            }
            onChange={(event) => handleSelectOne(event, binding)}
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
            <NavLink to={`/app/users/${binding.user.id}/devices/${binding.device.id}`}>
              <Typography color="textPrimary" variant="body1" key={binding.id}>
                {binding.device?.name}
              </Typography>
            </NavLink>
          </Box>
        </TableCell>
        <TableCell>{deviceStates[binding.state]}</TableCell>
        <TableCell>{new Date(binding.creationDate || '').toLocaleString('en-US', { hour12: false })}</TableCell>
        <TableCell>{new Date(binding.editionDate || '').toLocaleString('en-US', { hour12: false })}</TableCell>
      </TableRow>
    ));

    const emptyRows = limit - Math.min(limit, deviceBindings.length - page * limit);

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
                    checked={selectedDeviceIds.length === deviceBindings.length}
                    color="primary"
                    indeterminate={selectedDeviceIds.length > 0 && selectedDeviceIds.length < deviceBindings.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>Состояние</TableCell>
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
        count={deviceBindings.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default DeviceBindingListTable;
