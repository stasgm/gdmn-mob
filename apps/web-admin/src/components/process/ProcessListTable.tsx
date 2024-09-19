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
} from '@mui/material';

import { IProcess, ICompany } from '@lib/types';

import { adminPath } from '../../utils/constants';
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

interface IProps {
  processes: IProcess[];
  companies: ICompany[];
  selectedProcesses?: IProcess[];
  limitRows?: number;
}

const ProcessListTable = ({ processes = [], selectedProcesses = [], limitRows = 0 }: IProps) => {
  const [selectedProcessIds, setSelectedProcessIds] = useState<IProcess[]>(selectedProcesses);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const maxHeight = useWindowResizeMaxHeight();

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
      return (
        <TableRow hover key={process.id} selected={selectedProcessIds.findIndex((d) => d.id === process?.id) !== -1}>
          <TableCell style={{ padding: '0 16px' }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <NavLink to={`${adminPath}/app/processes/${process.id}`}>
                <Typography color="textPrimary" variant="body1" key={process.id}>
                  {process.company.name}
                </Typography>
              </NavLink>
            </Box>
          </TableCell>
          <TableCell>{process.appSystem.name}</TableCell>
          <TableCell>{process.status}</TableCell>
          <TableCell>{new Date(process.dateBegin || '').toLocaleString('ru', { hour12: false })}</TableCell>
          <TableCell>
            {process.dateReadyToCommit
              ? new Date(process?.dateReadyToCommit || '').toLocaleString('ru', { hour12: false })
              : ''}
          </TableCell>
          <TableCell>{new Date(process.dateEnd || '').toLocaleString('ru', { hour12: false })}</TableCell>
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
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Компания</TableCell>
                <TableCell>Подсистема</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата начала</TableCell>
                <TableCell>Дата подготовки</TableCell>
                <TableCell>Дата окончания</TableCell>
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
