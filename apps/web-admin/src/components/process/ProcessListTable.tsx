import { profileEnd } from 'console';

import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import PerfectScrollbar from 'react-perfect-scrollbar';

import RefreshIcon from '@material-ui/icons/Refresh';

import Tooltip from '@material-ui/core/Tooltip';

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

import { IDevice, IActivationCode, IProcess, ICompany } from '@lib/types';

import { deviceStates, adminPath } from '../../utils/constants';

interface IProps {
  processes: IProcess[];
  companies: ICompany[];
  // devices: IDevice[];
  selectedProcesses?: IProcess[];
  // activationCodes: IActivationCode[];
  limitRows?: number;
  onCreateCode?: (deviceId: string) => void;
  onChangeSelectedDevices?: (newSelectedDeviceIds: any[]) => void;
  onCreateUid?: (code: string, deviceId: string) => void;
}

const ProcessListTable = ({
  processes = [],
  companies = [],
  // devices = [],
  // activationCodes = [],
  onChangeSelectedDevices,
  selectedProcesses = [],
  limitRows = 0,
  onCreateCode,
  onCreateUid,
}: IProps) => {
  const [selectedProcessIds, setSelectedProcessIds] = useState<IProcess[]>(selectedProcesses);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  console.log('processes', processes);

  console.log('comp', companies);

  const handleSelectAll = (event: any) => {
    let newSelectedProcessIds;

    if (event.target.checked) {
      newSelectedProcessIds = processes.map((process: any) => process);
    } else {
      newSelectedProcessIds = [];
    }

    setSelectedProcessIds(newSelectedProcessIds);
    onChangeSelectedDevices && onChangeSelectedDevices(newSelectedProcessIds);
  };

  const handleSelectOne = (_event: any, process: IProcess) => {
    const selectedIndex = selectedProcessIds.map((item: IProcess) => item.id).indexOf(process.id);

    let newSelectedProcessIds: IProcess[] = [];

    if (selectedIndex === -1) {
      newSelectedProcessIds = newSelectedProcessIds.concat(selectedProcessIds, process);
    } else if (selectedIndex === 0) {
      newSelectedProcessIds = newSelectedProcessIds.concat(selectedProcessIds.slice(1));
    } else if (selectedIndex === selectedProcessIds.length - 1) {
      newSelectedProcessIds = newSelectedProcessIds.concat(selectedProcessIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedProcessIds = newSelectedProcessIds.concat(
        selectedProcessIds.slice(0, selectedIndex),
        selectedProcessIds.slice(selectedIndex + 1),
      );
    }

    setSelectedProcessIds(newSelectedProcessIds);

    onChangeSelectedDevices && onChangeSelectedDevices(newSelectedProcessIds);
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

    if (selectedProcessIds.length === 0) {
      if (selectedProcesses.length > 0) {
        const newSelectedProcessIds = selectedProcesses.map((process: IProcess) => process);

        setSelectedProcessIds(newSelectedProcessIds);
      }
    }
  }, [limitRows, selectedProcessIds.length, selectedProcesses]);

  const TableRows = () => {
    const processList = processes.slice(page * limit, page * limit + limit).map((process: IProcess) => {
      const company = companies.find((a) => a.id === process.companyId)?.name;

      return (
        <TableRow hover key={process.id} selected={selectedProcessIds.findIndex((d) => d.id === process?.id) !== -1}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={
                selectedProcessIds
                  .map((item: IProcess) => {
                    return item.id;
                  })
                  .indexOf(process.id) !== -1
              }
              onChange={(event) => handleSelectOne(event, process)}
              value="true"
            />
          </TableCell>
          {/* <TableCell style={{ padding: '0 16px' }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <NavLink to={`${adminPath}/app/devices/${process.id}`}>
                <Typography color="textPrimary" variant="body1" key={process.id}>
                  {process.name}
                </Typography>
              </NavLink>
            </Box>
          </TableCell> */}
          {/* <TableCell>{device.uid}</TableCell> */}

          {/* <TableCell>
            <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Box style={{ width: '40px' }}>{/*activationCodes.find((a) => a.device.id === device.id)?.* code}</Box>
              <Box>
                {onCreateCode && (
                  <Tooltip title="Создать код">
                    <Button
                      // component={RouterLink}
                      onClick={() => onCreateCode(device.id)}
                    >
                      <RefreshIcon />
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </TableCell> */}

          <TableCell style={{ padding: '0 16px' }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <NavLink to={`${adminPath}/app/processes/${process.id}`}>
                <Typography color="textPrimary" variant="body1" key={process.id}>
                  {company}
                </Typography>
              </NavLink>
            </Box>
          </TableCell>
          {/* <TableCell>{company}</TableCell> */}
          <TableCell>{process.appSystem}</TableCell>
          <TableCell>{process.status}</TableCell>
          <TableCell>{new Date(process.dateBegin || '').toLocaleString('ru', { hour12: false })}</TableCell>
          {/* <TableCell>{new Date(device.editionDate || '').toLocaleString('ru', { hour12: false })}</TableCell> */}
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, processes.length - page * limit);

    return (
      <>
        {processList}
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
                    checked={selectedProcessIds.length === processes.length}
                    color="primary"
                    indeterminate={selectedProcessIds.length > 0 && selectedProcessIds.length < processes.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Компания</TableCell>
                <TableCell>Система</TableCell>
                <TableCell>Статус</TableCell>
                {/* <TableCell>Код активации</TableCell> */}
                <TableCell>Дата</TableCell>
                {/* <TableCell>Дата редактирования</TableCell> */}
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
        count={processes.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default ProcessListTable;
