import { useState, useEffect, useMemo } from 'react';
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
  TextField,
} from '@material-ui/core';

import { IDeviceLogFiles } from '@lib/types';

import { useSettingThunkDispatch } from '@lib/store';
import { useFormik } from 'formik';

import { adminPath } from '../../utils/constants';

interface IProps {
  deviceLogFiles: IDeviceLogFiles[];
  selectedDeviceLogFiles?: IDeviceLogFiles[];
  limitRows?: number;
  onChangeSelectedDeviceLogFiles?: (newSelectedDeviceIds: any[]) => void;
  isFilterVisible?: boolean;
  onSubmit: (values: any) => void;
}

const DeviceLogFilesListTable = ({
  deviceLogFiles = [],
  onChangeSelectedDeviceLogFiles,
  selectedDeviceLogFiles = [],
  limitRows = 0,
  isFilterVisible = false,
  onSubmit,
}: IProps) => {
  const [selectedDeviceLogFileIds, setSelectedDeviceLogFileIds] = useState<IDeviceLogFiles[]>(selectedDeviceLogFiles);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const formik = useFormik<any>({
    enableReinitialize: true,
    initialValues: {
      // ...user,
      appSystem: '',
      company: '',
      contact: '',
      date: '',
      device: '',
      uid: '',
      path: '',
      size: '',
    },

    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const filtered = useMemo(() => {
    if (
      formik.values.appSystem ||
      formik.values.company ||
      formik.values.contact ||
      formik.values.date ||
      formik.values.device ||
      formik.values.uid
      // ||
      // formik.values.path
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
        // &&
        // (formik.values.path ? i.path.toUpperCase().includes(formik.values.path.toUpperCase()) : true),
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

  // console.log('filtered', filtered);
  const handleSelectAll = (event: any) => {
    let newSelectedDeviceLogFileIds;

    if (event.target.checked) {
      newSelectedDeviceLogFileIds = deviceLogFiles.map((deviceLogFile: any) => deviceLogFile);
    } else {
      newSelectedDeviceLogFileIds = [];
    }

    setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);
    onChangeSelectedDeviceLogFiles && onChangeSelectedDeviceLogFiles(newSelectedDeviceLogFileIds);
  };

  const handleSelectOne = (_event: any, deviceLogFile: IDeviceLogFiles) => {
    const selectedIndex = selectedDeviceLogFileIds.map((item: IDeviceLogFiles) => item.id).indexOf(deviceLogFile.id);

    let newSelectedDeviceLogFileIds: IDeviceLogFiles[] = [];

    if (selectedIndex === -1) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(selectedDeviceLogFileIds, deviceLogFile);
    } else if (selectedIndex === 0) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(selectedDeviceLogFileIds.slice(1));
    } else if (selectedIndex === selectedDeviceLogFileIds.length - 1) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(selectedDeviceLogFileIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(
        selectedDeviceLogFileIds.slice(0, selectedIndex),
        selectedDeviceLogFileIds.slice(selectedIndex + 1),
      );
    }

    setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);

    onChangeSelectedDeviceLogFiles && onChangeSelectedDeviceLogFiles(newSelectedDeviceLogFileIds);
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

    if (selectedDeviceLogFileIds.length === 0) {
      if (selectedDeviceLogFiles.length > 0) {
        const newSelectedDeviceLogFileIds = selectedDeviceLogFiles.map(
          (deviceLogFile: IDeviceLogFiles) => deviceLogFile,
        );

        setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);
      }
    }
  }, [limitRows, selectedDeviceLogFileIds.length, selectedDeviceLogFiles]);

  const TableRows = () => {
    const deviceLogFileList = filtered
      .slice(page * limit, page * limit + limit)
      .map((deviceLogFile: IDeviceLogFiles) => {
        return (
          <TableRow
            hover
            key={deviceLogFile.id}
            selected={selectedDeviceLogFileIds.findIndex((d) => d.id === deviceLogFile?.id) !== -1}
          >
            {/* <NavLink to={`${adminPath}/app/deviceLogs/${deviceLogFile.id}`}> */}
            <TableCell padding="checkbox">
              <Checkbox
                checked={
                  selectedDeviceLogFileIds
                    .map((item: IDeviceLogFiles) => {
                      return item.id;
                    })
                    .indexOf(deviceLogFile.id) !== -1
                }
                onChange={(event) => handleSelectOne(event, deviceLogFile)}
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
                <NavLink to={`${adminPath}/app/deviceLogs/${deviceLogFile.id}`}>
                  <Typography color="textPrimary" variant="body1" key={deviceLogFile.id}>
                    {deviceLogFile.path}
                  </Typography>
                </NavLink>
              </Box>
            </TableCell> */}
            <TableCell>
              <NavLink to={`${adminPath}/app/deviceLogs/${deviceLogFile.id}`}>
                <Typography color="textPrimary" variant="body1" key={deviceLogFile.id}>
                  {deviceLogFile.company.name}{' '}
                </Typography>
              </NavLink>
            </TableCell>
            <TableCell>{deviceLogFile.appSystem.name}</TableCell>
            <TableCell>{deviceLogFile.contact.name}</TableCell>
            {/* <TableCell>{message.producer.name}</TableCell>
          <TableCell>{message.consumer.name}</TableCell> */}
            <TableCell>{deviceLogFile.device.name}</TableCell>
            <TableCell>{deviceLogFile.device.id}</TableCell>
            <TableCell>{new Date(deviceLogFile.date || '').toLocaleString('ru', { hour12: false })}</TableCell>
            {/* <TableCell>{message.size} кб</TableCell> */}
            <TableCell>{Math.ceil(deviceLogFile.size).toString()} кб</TableCell>
            {/* </NavLink> */}
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
        <Box sx={{ p: 1, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedDeviceLogFileIds.length === deviceLogFiles.length}
                    color="primary"
                    indeterminate={
                      selectedDeviceLogFileIds.length > 0 && selectedDeviceLogFileIds.length < deviceLogFiles.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell style={{ flexDirection: 'column' }}>
                  <Typography color="textPrimary" variant="inherit">
                    Компания
                  </Typography>
                  {/* {isFilterVisible ? (
                    <TextField
                      InputProps={{
                        sx: {
                          height: 30,
                          // maxWidth: 100,
                          fontSize: 13,
                          '& .MuiOutlinedInput-input': {
                            borderWidth: 0,
                            padding: 0.5,
                          },
                        },
                      }}
                      // sx={{ maxWidth: 100 }}
                      fullWidth
                      name="company"
                      required
                      variant="outlined"
                      type="search"
                      value={formik.values.company}
                      onChange={formik.handleChange}
                    />
                  ) : null} */}
                </TableCell>
                <TableCell style={{ flexDirection: 'column' }}>
                  <Typography color="textPrimary" variant="inherit">
                    Подсистема
                  </Typography>
                </TableCell>
                <TableCell style={{ flexDirection: 'column' }}>
                  <Typography color="textPrimary" variant="inherit">
                    Пользователь
                  </Typography>
                </TableCell>
                {/* <TableCell>Отправитель</TableCell>
                <TableCell>Получатель</TableCell> */}
                <TableCell style={{ flexDirection: 'column' }}>
                  <Typography color="textPrimary" variant="inherit">
                    Устройство
                  </Typography>
                </TableCell>
                <TableCell style={{ flexDirection: 'column' }}>
                  <Typography color="textPrimary" variant="inherit">
                    Идентификатор
                  </Typography>
                </TableCell>
                <TableCell style={{ flexDirection: 'column' }}>
                  <Typography color="textPrimary" variant="inherit">
                    Дата
                  </Typography>
                </TableCell>
                <TableCell>Размер</TableCell>
              </TableRow>
              {isFilterVisible ? (
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    {isFilterVisible ? (
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
                        name="company"
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values.company}
                        onChange={formik.handleChange}
                      />
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {isFilterVisible ? (
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
                        name="appSystem"
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values.appSystem}
                        onChange={formik.handleChange}
                      />
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {isFilterVisible ? (
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
                        name="contact"
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values.contact}
                        onChange={formik.handleChange}
                      />
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {isFilterVisible ? (
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
                        name="device"
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values.device}
                        onChange={formik.handleChange}
                      />
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {isFilterVisible ? (
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
                        name="uid"
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values.uid}
                        onChange={formik.handleChange}
                      />
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {isFilterVisible ? (
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
                        name="date"
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                      />
                    ) : null}
                  </TableCell>
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
