import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

import PerfectScrollbar from 'react-perfect-scrollbar';

import RefreshIcon from '@mui/icons-material/Refresh';

import Tooltip from '@mui/material/Tooltip';

import { Box, Button, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';

import { IDevice, IActivationCode } from '@lib/types';

import { deviceStates, adminPath } from '../../utils/constants';
import { IPageParam } from '../../types';
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

interface IProps {
  devices: IDevice[];
  selectedDevices?: IDevice[];
  activationCodes: IActivationCode[];
  limitRows?: number;
  onCreateCode?: (deviceId: string) => void;
  onCreateUid: (code: string, deviceId: string) => void;
  onSetPageParams: (pageParams: IPageParam) => void;
  pageParams?: IPageParam | undefined;
}
const rowStyle = { height: 53, cursor: 'pointer' };

const DeviceListTable = ({
  devices = [],
  activationCodes = [],
  limitRows = 0,
  onCreateCode,
  onCreateUid,
  onSetPageParams,
  pageParams,
}: IProps) => {
  const navigate = useNavigate();
  const maxHeight = useWindowResizeMaxHeight();

  const [limit, setLimit] = useState(
    pageParams?.limit && !isNaN(Number(pageParams?.limit)) ? Number(pageParams?.limit) : 10,
  );
  const [page, setPage] = useState(pageParams?.page && !isNaN(Number(pageParams?.page)) ? Number(pageParams.page) : 0);

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
  }, [limitRows]);

  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>, id: string) => {
      if (!window.getSelection()?.toString()) {
        navigate(`${adminPath}/app/devices/${id}`);
      }
    },
    [navigate],
  );

  const TableRows = useMemo(() => {
    const deviceList = devices.slice(page * limit, page * limit + limit).map((device: IDevice) => {
      const code = activationCodes.find((a) => a.device.id === device.id)?.code;

      return (
        <TableRow
          sx={rowStyle}
          hover
          key={device.id}
          onClick={(e) => handleRowClick(e, device.id)}
          style={{ cursor: 'pointer' }}
        >
          <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap', userSelect: 'text' }}>{device.name}</TableCell>
          <TableCell>{device.id} </TableCell>
          <TableCell>
            <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Box style={{ width: '90px' }}>{device.uid}</Box>
              {code && (
                <Box>
                  <Tooltip title="Создать номер">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onCreateUid(code, device.id);
                      }}
                    >
                      <RefreshIcon />
                    </Button>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </TableCell>
          <TableCell>{deviceStates[device.state]}</TableCell>
          <TableCell>
            <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Box style={{ width: '40px' }}>{code}</Box>
              <Box>
                {onCreateCode && (
                  <Tooltip title="Создать код">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onCreateCode(device.id);
                      }}
                    >
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
  }, [devices, page, limit, activationCodes, onCreateCode, handleRowClick, onCreateUid]);

  return (
    <Card sx={{ mt: 2 }}>
      <PerfectScrollbar>
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight }}>
          <Table sx={{ '& .MuiTableCell-root': { width: 'auto', whiteSpace: 'nowrap', userSelect: 'text' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap', userSelect: 'text' }}>Наименование</TableCell>
                <TableCell>Идентификатор</TableCell>
                <TableCell>Номер</TableCell>
                <TableCell>Состояние</TableCell>
                <TableCell>Код активации</TableCell>
                <TableCell>Компания</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell>Дата редактирования</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{TableRows}</TableBody>
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
