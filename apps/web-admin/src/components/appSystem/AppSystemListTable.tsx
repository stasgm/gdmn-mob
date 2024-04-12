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
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';
import { IPageParam } from '../../types';

interface IProps {
  appSystems: IAppSystem[];
  selectedAppSystems?: IAppSystem[];
  onSetPageParams?: (pageParams: IPageParam) => void;
  pageParams?: IPageParam | undefined;
  onChangeSelectedAppSystems?: (newSelectedDeviceIds: any[]) => void;
}

const AppSystemListTable = ({
  appSystems = [],
  onChangeSelectedAppSystems,
  selectedAppSystems = [],
  onSetPageParams,
  pageParams,
}: IProps) => {
  const [selectedAppSystemIds, setSelectedAppSystemIds] = useState<IAppSystem[]>(selectedAppSystems);
  const [limit, setLimit] = useState(
    pageParams?.limit && !isNaN(Number(pageParams?.limit)) ? Number(pageParams?.limit) : 10,
  );
  const [page, setPage] = useState(pageParams?.page && !isNaN(Number(pageParams?.page)) ? Number(pageParams.page) : 0);
  const maxHeight = useWindowResizeMaxHeight();

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newSelectedAppSystemIds;

    if (event.target.checked) {
      newSelectedAppSystemIds = appSystems.map((appSystem: any) => appSystem);
    } else {
      newSelectedAppSystemIds = [];
    }

    setSelectedAppSystemIds(newSelectedAppSystemIds);
    onChangeSelectedAppSystems && onChangeSelectedAppSystems(newSelectedAppSystemIds);
  };

  const isAppSystemSelected = (appSystem: IAppSystem) =>
    selectedAppSystemIds.findIndex((d) => d.id === appSystem?.id) !== -1;

  const handleSelectOne = (_event: React.ChangeEvent<HTMLInputElement>, appSystem: IAppSystem) => {
    const isSelected = isAppSystemSelected(appSystem);

    let newSelectedAppSystemIds: IAppSystem[] = [];

    if (!isSelected) {
      newSelectedAppSystemIds = newSelectedAppSystemIds.concat(selectedAppSystemIds, appSystem);
    } else {
      newSelectedAppSystemIds = selectedAppSystemIds.filter(
        (selectedAppSystem) => selectedAppSystem.id !== appSystem.id,
      );
    }

    setSelectedAppSystemIds(newSelectedAppSystemIds);

    onChangeSelectedAppSystems && onChangeSelectedAppSystems(newSelectedAppSystemIds);
  };

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
    onSetPageParams && onSetPageParams({ ...pageParams, limit: event.target.value });
  };

  const handlePageChange = (_event: any, newPage: number) => {
    setPage(newPage);
    onSetPageParams && onSetPageParams({ ...pageParams, page: newPage });
  };

  useEffect(() => {
    if (selectedAppSystemIds.length === 0) {
      if (selectedAppSystems.length > 0) {
        const newSelectedAppSystemIds = selectedAppSystems.map((appSystem: IAppSystem) => appSystem);

        setSelectedAppSystemIds(newSelectedAppSystemIds);
      }
    }
  }, [selectedAppSystemIds.length, selectedAppSystems]);

  const TableRows = () => {
    const appSystemList = appSystems.slice(page * limit, page * limit + limit).map((appSystem: IAppSystem) => {
      return (
        <TableRow hover key={appSystem.id} selected={isAppSystemSelected(appSystem)}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={isAppSystemSelected(appSystem)}
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
          <TableCell>{appSystem.id}</TableCell>
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
    <Card sx={{ mt: 2 }}>
      <PerfectScrollbar>
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight }}>
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
                <TableCell>Идентификатор</TableCell>
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
