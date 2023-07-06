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

import { IAppSystem } from '@lib/types';

import { adminPath } from '../../utils/constants';

interface IProps {
  appSystems: IAppSystem[];
  selectedAppSystems?: IAppSystem[];
  limitRows?: number;
  onChangeSelectedAppSystems?: (newSelectedDeviceIds: any[]) => void;
}

const AppSystemListTable = ({
  appSystems = [],
  onChangeSelectedAppSystems,
  selectedAppSystems = [],
  limitRows = 0,
}: IProps) => {
  const [selectedAppSystemIds, setSelectedAppSystemIds] = useState<IAppSystem[]>(selectedAppSystems);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event: any) => {
    let newSelectedAppSystemIds;

    if (event.target.checked) {
      newSelectedAppSystemIds = appSystems.map((appSystem: any) => appSystem);
    } else {
      newSelectedAppSystemIds = [];
    }

    setSelectedAppSystemIds(newSelectedAppSystemIds);
    onChangeSelectedAppSystems && onChangeSelectedAppSystems(newSelectedAppSystemIds);
  };

  const handleSelectOne = (_event: any, appSystem: IAppSystem) => {
    const selectedIndex = selectedAppSystemIds.map((item: IAppSystem) => item.id).indexOf(appSystem.id);

    let newSelectedAppSystemIds: IAppSystem[] = [];

    if (selectedIndex === -1) {
      newSelectedAppSystemIds = newSelectedAppSystemIds.concat(selectedAppSystemIds, appSystem);
    } else if (selectedIndex === 0) {
      newSelectedAppSystemIds = newSelectedAppSystemIds.concat(selectedAppSystemIds.slice(1));
    } else if (selectedIndex === selectedAppSystemIds.length - 1) {
      newSelectedAppSystemIds = newSelectedAppSystemIds.concat(selectedAppSystemIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedAppSystemIds = newSelectedAppSystemIds.concat(
        selectedAppSystemIds.slice(0, selectedIndex),
        selectedAppSystemIds.slice(selectedIndex + 1),
      );
    }

    setSelectedAppSystemIds(newSelectedAppSystemIds);

    onChangeSelectedAppSystems && onChangeSelectedAppSystems(newSelectedAppSystemIds);
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

    if (selectedAppSystemIds.length === 0) {
      if (selectedAppSystems.length > 0) {
        const newSelectedAppSystemIds = selectedAppSystems.map((appSystem: IAppSystem) => appSystem);

        setSelectedAppSystemIds(newSelectedAppSystemIds);
      }
    }
  }, [limitRows, selectedAppSystemIds.length, selectedAppSystems]);

  const TableRows = () => {
    const appSystemList = appSystems.slice(page * limit, page * limit + limit).map((appSystem: IAppSystem) => {
      return (
        <TableRow
          hover
          key={appSystem.id}
          selected={selectedAppSystemIds.findIndex((d) => d.id === appSystem?.id) !== -1}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={
                selectedAppSystemIds
                  .map((item: IAppSystem) => {
                    return item.id;
                  })
                  .indexOf(appSystem.id) !== -1
              }
              onChange={(event) => handleSelectOne(event, appSystem)}
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
              <NavLink to={`${adminPath}/app/appSystems/${appSystem.id}`}>
                <Typography color="textPrimary" variant="body1" key={appSystem.id}>
                  {appSystem.name}
                </Typography>
              </NavLink>
            </Box>
          </TableCell>
          <TableCell>{appSystem.description}</TableCell>
          <TableCell>{new Date(appSystem.creationDate || '').toLocaleString('ru', { hour12: false })}</TableCell>
          <TableCell>{new Date(appSystem.editionDate || '').toLocaleString('ru', { hour12: false })}</TableCell>
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, appSystems.length - page * limit);

    return (
      <>
        {appSystemList}
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
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight: window.innerHeight - 268 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAppSystemIds.length === appSystems.length}
                    color="primary"
                    indeterminate={selectedAppSystemIds.length > 0 && selectedAppSystemIds.length < appSystems.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>Описание</TableCell>
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
        count={appSystems.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default AppSystemListTable;
