import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
  TextField,
} from '@mui/material';

import { IDeviceLogFile } from '@lib/types';

import { useFormik } from 'formik';

import { adminPath } from '../../utils/constants';
import { IDeviceLogFileFilter, IDeviceLogPageParam, IPageParam } from '../../types';
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

interface IProps {
  deviceLogFiles: IDeviceLogFile[];
  selectedDeviceLogFiles: IDeviceLogFile[];
  limitRows?: number;
  isFilterVisible?: boolean;
  onSubmit: (values: any) => void;
  onDelete?: (ids?: string[]) => void;
  onSelectOne: (_event: any, file: IDeviceLogFile) => void;
  onSelectMany: (event: any) => void;
  onSetPageParams: (logFilters: IPageParam) => void;
  pageParams?: IDeviceLogPageParam | undefined;
}

const DeviceLogFilesListTable = ({
  deviceLogFiles = [],
  isFilterVisible = false,
  onSubmit,
  onSelectOne,
  onSelectMany,
  selectedDeviceLogFiles,
  onSetPageParams,
  pageParams,
}: IProps) => {
  const [limit, setLimit] = useState(
    pageParams?.limit && !isNaN(Number(pageParams?.limit)) ? Number(pageParams?.limit) : 10,
  );
  const [page, setPage] = useState(pageParams?.page && !isNaN(Number(pageParams?.page)) ? Number(pageParams.page) : 0);

  const maxHeight = useWindowResizeMaxHeight();

  const initialValues = useMemo(() => {
    return {
      company: '',
      appSystem: '',
      producer: '',
      device: '',
      uid: '',
      date: '',
      mDate: '',
    };
  }, []);

  const navigate = useNavigate();

  const formik = useFormik<IDeviceLogFileFilter>({
    enableReinitialize: true,
    initialValues: pageParams?.logFilters || initialValues,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (!isFilterVisible) {
      formik.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilterVisible]);

  const handleSearchClick = () => {
    onSetPageParams({ ...pageParams, logFilters: formik.values, page: 0 });
    setPage(0);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleLimitChange = useCallback(
    (event: any) => {
      setLimit(event.target.value);
      onSetPageParams && onSetPageParams({ ...pageParams, limit: event.target.value });
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

  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>, id: string) => {
      if (!window.getSelection()?.toString()) {
        e.preventDefault();
        navigate(`${adminPath}/app/deviceLogs/${id}`);
      }
    },
    [navigate],
  );

  const TableRows = () => {
    const deviceLogFileList = deviceLogFiles
      .slice(page * limit, page * limit + limit)
      .map((deviceLogFile: IDeviceLogFile) => {
        return (
          <TableRow
            hover
            key={deviceLogFile.id}
            selected={selectedDeviceLogFiles?.findIndex((d) => d.id === deviceLogFile?.id) !== -1}
            onClick={(event) => handleRowClick(event, deviceLogFile.id)}
            sx={{ cursor: 'pointer' }}
          >
            <TableCell
              padding="checkbox"
              onClick={(event) => {
                event.stopPropagation();
                onSelectOne(event, deviceLogFile);
              }}
            >
              <Checkbox
                checked={
                  selectedDeviceLogFiles
                    ?.map((item: IDeviceLogFile) => {
                      return item.id;
                    })
                    .indexOf(deviceLogFile.id) !== -1
                }
                value="true"
              />
            </TableCell>
            <TableCell>{deviceLogFile.company.name}</TableCell>
            <TableCell>{deviceLogFile.appSystem.name}</TableCell>
            <TableCell>{deviceLogFile.producer.name}</TableCell>
            <TableCell>{deviceLogFile.device.name}</TableCell>
            <TableCell>{deviceLogFile.device.id}</TableCell>
            <TableCell>{new Date(deviceLogFile.date || '').toLocaleString('ru', { hour12: false })}</TableCell>
            <TableCell>{new Date(deviceLogFile.mdate || '').toLocaleString('ru', { hour12: false })}</TableCell>
            <TableCell>{Math.ceil(deviceLogFile.size).toString()} кб</TableCell>
          </TableRow>
        );
      });

    const emptyRows = limit - Math.min(limit, deviceLogFiles.length - page * limit);

    return (
      <>
        {deviceLogFileList}
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
          <Table sx={{ '& .MuiTableCell-root': { width: 'auto', whiteSpace: 'nowrap', userSelect: 'text' } }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedDeviceLogFiles?.length === deviceLogFiles.length}
                    color="primary"
                    indeterminate={
                      selectedDeviceLogFiles.length > 0 && selectedDeviceLogFiles.length < deviceLogFiles.length
                    }
                    onChange={onSelectMany}
                  />
                </TableCell>
                <TableCell>Компания</TableCell>
                <TableCell>Подсистема</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Устройство</TableCell>
                <TableCell>ИД устройства</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell>Дата редактирования</TableCell>
                <TableCell>Размер</TableCell>
              </TableRow>
              {isFilterVisible ? (
                <TableRow>
                  <TableCell></TableCell>
                  {Object.keys(initialValues).map((item) => (
                    <TableCell key={item}>
                      <TextField
                        InputProps={{
                          sx: {
                            height: 30,
                            fontSize: 13,
                            '& .MuiOutlinedInput-input': {
                              borderWidth: 0,
                              padding: 0.5,
                            },
                          },
                        }}
                        fullWidth
                        name={item}
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values[item]}
                        onChange={formik.handleChange}
                        onKeyPress={(event) => handleKeyPress(event.key)}
                      />
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              ) : null}
            </TableHead>
            <TableBody>
              <TableRows />
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={deviceLogFiles.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default DeviceLogFilesListTable;
