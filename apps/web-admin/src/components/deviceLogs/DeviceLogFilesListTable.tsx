import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
} from '@material-ui/core';

import { IDeviceLogFiles } from '@lib/types';

import { useFormik } from 'formik';

import { adminPath } from '../../utils/constants';
import { IDeviceLogFileFormik, IPageParam } from '../../types';

interface IProps {
  deviceLogFiles: IDeviceLogFiles[];
  selectedDeviceLogFiles: IDeviceLogFiles[];
  limitRows?: number;
  // onChangeSelectedDeviceLogFiles: (newSelectedDeviceIds: any[]) => void;
  isFilterVisible?: boolean;
  onSubmit: (values: any) => void;
  onDelete?: (ids?: string[]) => void;
  onSelectOne: (_event: any, file: IDeviceLogFiles) => void;
  onSelectMany: (event: any) => void;
  onSetPageParams: (logFilters: IPageParam) => void;
  pageParams?: IPageParam | undefined;
}

const DeviceLogFilesListTable = ({
  deviceLogFiles = [],
  // onChangeSelectedDeviceLogFiles,
  // selectedDeviceLogFiles = [],
  // limitRows = 0,
  isFilterVisible = false,
  onSubmit,
  onSelectOne,
  onSelectMany,
  selectedDeviceLogFiles,
  onSetPageParams,
  pageParams,
}: IProps) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const initialValues = useMemo(() => {
    return {
      company: '',
      appSystem: '',
      contact: '',
      device: '',
      uid: '',
      date: '',
    };
  }, []);

  const navigate = useNavigate();

  const formik = useFormik<IDeviceLogFileFormik>({
    enableReinitialize: true,
    initialValues: pageParams?.logFilters ? (pageParams?.logFilters as IDeviceLogFileFormik) : initialValues,
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

  const filteredList = useMemo(() => {
    if (
      formik.values.appSystem ||
      formik.values.company ||
      formik.values.contact ||
      formik.values.date ||
      formik.values.device ||
      formik.values.uid
    ) {
      return deviceLogFiles.filter(
        (i) =>
          (formik.values.appSystem
            ? i.appSystem.name.toUpperCase().includes(formik.values.appSystem.toUpperCase())
            : true) &&
          (formik.values.company ? i.company.name.toUpperCase().includes(formik.values.company.toUpperCase()) : true) &&
          (formik.values.contact ? i.contact.name.toUpperCase().includes(formik.values.contact.toUpperCase()) : true) &&
          (formik.values.date
            ? new Date(i.date || '')
                .toLocaleString('ru', { hour12: false })
                .toUpperCase()
                .includes(formik.values.date.toUpperCase())
            : true) &&
          (formik.values.device ? i.device.name.toUpperCase().includes(formik.values.device.toUpperCase()) : true) &&
          (formik.values.uid ? i.device.id.toUpperCase().includes(formik.values.uid.toUpperCase()) : true),
      );
    } else {
      return deviceLogFiles;
    }
  }, [
    deviceLogFiles,
    formik.values.appSystem,
    formik.values.company,
    formik.values.contact,
    formik.values.date,
    formik.values.device,

    formik.values.uid,
  ]);

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: any) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (isFilterVisible && formik.values !== initialValues) {
      onSetPageParams({ logFilters: formik.values });
    }
    // }, [onSetPageParams]);
  }, [formik.values, initialValues, isFilterVisible, onSetPageParams]);

  // useEffect(() => {
  //   if (limitRows > 0) {
  //     setLimit(limitRows);
  //   }

  //   if (selectedDeviceLogFileIds.length === 0) {
  //     if (selectedDeviceLogFiles.length > 0) {
  //       const newSelectedDeviceLogFileIds = selectedDeviceLogFiles.map(
  //         (deviceLogFile: IDeviceLogFiles) => deviceLogFile,
  //       );

  //       setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);
  //     }
  //   }
  // }, [limitRows, selectedDeviceLogFileIds.length, selectedDeviceLogFiles]);

  const TableRows = () => {
    const deviceLogFileList = filteredList
      .slice(page * limit, page * limit + limit)
      .map((deviceLogFile: IDeviceLogFiles) => {
        return (
          <TableRow
            hover
            key={deviceLogFile.id}
            selected={selectedDeviceLogFiles?.findIndex((d) => d.id === deviceLogFile?.id) !== -1}
            onClick={(event) => {
              event.preventDefault();
              navigate(`${adminPath}/app/deviceLogs/${deviceLogFile.id}`);
            }}
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
                    ?.map((item: IDeviceLogFiles) => {
                      return item.id;
                    })
                    .indexOf(deviceLogFile.id) !== -1
                }
                // onChange={(event) => onSelectOne(event, deviceLogFile)}
                value="true"
              />
            </TableCell>
            <TableCell>{deviceLogFile.company.name}</TableCell>
            <TableCell>{deviceLogFile.appSystem.name}</TableCell>
            <TableCell>{deviceLogFile.contact.name}</TableCell>
            <TableCell>{deviceLogFile.device.name}</TableCell>
            <TableCell>{deviceLogFile.device.id}</TableCell>
            <TableCell>{new Date(deviceLogFile.date || '').toLocaleString('ru', { hour12: false })}</TableCell>
            <TableCell>{Math.ceil(deviceLogFile.size).toString()} кб</TableCell>
          </TableRow>
        );
      });

    const emptyRows = limit - Math.min(limit, filteredList.length - page * limit);

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
        <Box sx={{ p: 1, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedDeviceLogFiles?.length === filteredList.length}
                    color="primary"
                    indeterminate={
                      selectedDeviceLogFiles.length > 0 && selectedDeviceLogFiles.length < filteredList.length
                    }
                    onChange={onSelectMany}
                  />
                </TableCell>
                <TableCell>Компания</TableCell>
                <TableCell>Подсистема</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Устройство</TableCell>
                <TableCell>Идентификатор</TableCell>
                <TableCell>Дата</TableCell>
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
        count={filteredList.length}
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