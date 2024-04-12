import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import PerfectScrollbar from 'react-perfect-scrollbar';

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
  Tooltip,
  Typography,
} from '@mui/material';
import { IDeviceBinding, IActivationCode, IDevice } from '@lib/types';

import RefreshIcon from '@mui/icons-material/Refresh';

import { deviceStates, adminPath } from '../../utils/constants';
import { IPageParam } from '../../types';
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

interface IProps {
  deviceBindings?: IDeviceBinding[];
  devices?: IDevice[];
  activationCodes?: IActivationCode[];
  onCreateCode?: (deviceId: string) => void;
  onCreateUid?: (code: string, deviceId: string) => void;
  selectedDevices?: IDeviceBinding[];
  onChangeSelectedDevices?: (newSelectedDeviceIds: any[]) => void;
  onSetPageParams?: (pageParams: IPageParam) => void;
  pageParams?: IPageParam | undefined;
}

const DeviceBindingListTable = ({
  deviceBindings = [],
  devices = [],
  activationCodes = [],
  onCreateCode,
  onCreateUid,
  onChangeSelectedDevices,
  selectedDevices = [],
  onSetPageParams,
  pageParams,
}: IProps) => {
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<IDeviceBinding[]>(selectedDevices);
  const [limit, setLimit] = useState(pageParams?.limit || 10);
  const [page, setPage] = useState(pageParams?.page || 0);
  const maxHeight = useWindowResizeMaxHeight() - 112;

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

  const isBindSelected = (binding: IDeviceBinding) => selectedDeviceIds.findIndex((d) => d.id === binding?.id) !== -1;

  const handleSelectOne = (_event: any, binding: IDeviceBinding) => {
    const isSelected = isBindSelected(binding);

    let newSelectedDeviceIds: IDeviceBinding[] = [];

    if (!isSelected) {
      newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedDeviceIds, binding);
    } else {
      newSelectedDeviceIds = selectedDeviceIds.filter((item) => item.id !== binding.id);
    }

    setSelectedDeviceIds(newSelectedDeviceIds);

    onChangeSelectedDevices && onChangeSelectedDevices(newSelectedDeviceIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
    onSetPageParams && onSetPageParams({ limit: event.target.value });
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
    onSetPageParams && onSetPageParams({ page: newPage });
  };

  useEffect(() => {
    if (selectedDeviceIds.length === 0) {
      if (selectedDevices.length > 0) {
        const newSelectedDeviceIds = selectedDevices.map((binding: IDeviceBinding) => binding);

        setSelectedDeviceIds(newSelectedDeviceIds);
      }
    }
  }, [selectedDeviceIds.length, selectedDevices]);

  const TableRows = () => {
    const deviceList = deviceBindings.slice(page * limit, page * limit + limit).map((binding: IDeviceBinding) => {
      const code = activationCodes.find((a) => a.device.id === binding.device.id)?.code;
      const device = devices.find((a) => a.id === binding.device.id);
      return (
        <TableRow hover key={binding.id} selected={isBindSelected(binding)}>
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
              <NavLink to={`${adminPath}/app/users/${binding.user.id}/binding/${binding.id}`}>
                <Typography color="textPrimary" variant="body1" key={binding.id}>
                  {binding.device?.name}
                </Typography>
              </NavLink>
            </Box>
          </TableCell>
          <TableCell>{binding.device.id}</TableCell>
          <TableCell>
            <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Box>
                {onCreateUid && (
                  <Tooltip title="Создать номер">
                    <Button onClick={() => onCreateUid && code && device && onCreateUid(code, device?.id)}>
                      <RefreshIcon />
                    </Button>
                  </Tooltip>
                )}
              </Box>
              <Box style={{ width: '40px' }}>{device?.uid}</Box>
            </Box>
          </TableCell>
          <TableCell>{deviceStates[binding.state]}</TableCell>
          <TableCell>
            <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Box style={{ width: '40px' }}>{code}</Box>
              <Box>
                {onCreateCode && (
                  <Tooltip title="Создать код">
                    <Button onClick={() => onCreateCode(binding.device.id)}>
                      <RefreshIcon />
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </TableCell>
          <TableCell>{new Date(binding.creationDate || '').toLocaleString('ru', { hour12: false })}</TableCell>
          <TableCell>{new Date(binding.editionDate || '').toLocaleString('ru', { hour12: false })}</TableCell>
        </TableRow>
      );
    });

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
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight }}>
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
                <TableCell>Идентификатор</TableCell>
                <TableCell>Номер</TableCell>
                <TableCell>Состояние</TableCell>
                <TableCell>Код активации</TableCell>
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
