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

import { IFileSystem } from '@lib/types';

import { useSettingThunkDispatch } from '@lib/store';
import { useFormik } from 'formik';

import { adminPath } from '../../utils/constants';

interface IProps {
  files: IFileSystem[];
  selectedFiles?: IFileSystem[];
  limitRows?: number;
  onChangeSelectedFiles?: (newSelectedDeviceIds: any[]) => void;
  isFilterVisible?: boolean;
  onSubmit: (values: any) => void;
}

const FileListTable = ({
  files = [],
  onChangeSelectedFiles,
  selectedFiles = [],
  limitRows = 0,
  isFilterVisible = false,
  onSubmit,
}: IProps) => {
  const [selectedFileIds, setSelectedFileIds] = useState<IFileSystem[]>(selectedFiles);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const formik = useFormik<any>({
    enableReinitialize: true,
    initialValues: {
      // ...user,
      appSystem: '',
      company: '',
      producer: '',
      consumer: '',
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
      formik.values.fileName ||
      formik.values.path ||
      formik.values.appSystem ||
      formik.values.company ||
      formik.values.contact ||
      formik.values.date ||
      formik.values.device ||
      formik.values.uid
      // ||
      // formik.values.path
    ) {
      return files.filter(
        (i) =>
          (formik.values.appSystem
            ? i.appSystem?.name.toUpperCase().includes(formik.values.appSystem.toUpperCase())
            : true) &&
          (formik.values.fileName ? i.fileName.toUpperCase().includes(formik.values.fileName.toUpperCase()) : true) &&
          (formik.values.path ? i.path?.toUpperCase().includes(formik.values.path.toUpperCase()) : true) &&
          (formik.values.company
            ? i.company?.name.toUpperCase().includes(formik.values.company.toUpperCase())
            : true) &&
          (formik.values.producer
            ? i.producer?.name.toUpperCase().includes(formik.values.producer.toUpperCase())
            : true) &&
          (formik.values.consumer
            ? i.consumer?.name.toUpperCase().includes(formik.values.consumer.toUpperCase())
            : true) &&
          (formik.values.date
            ? new Date(i.date || '')
                .toLocaleString('ru', { hour12: false })
                .toUpperCase()
                .includes(formik.values.date.toUpperCase())
            : true) &&
          (formik.values.device ? i.device?.name.toUpperCase().includes(formik.values.device.toUpperCase()) : true) &&
          (formik.values.uid ? i.device?.id.toUpperCase().includes(formik.values.uid.toUpperCase()) : true),
        // &&
        // (formik.values.path ? i.path.toUpperCase().includes(formik.values.path.toUpperCase()) : true),
      );
    } else {
      return files;
    }
  }, [
    files,
    formik.values.appSystem,
    formik.values.company,
    formik.values.consumer,
    formik.values.contact,
    formik.values.date,
    formik.values.device,
    formik.values.fileName,
    formik.values.path,
    formik.values.producer,
    formik.values.uid,
  ]);

  // console.log('filtered', filtered);
  const handleSelectAll = (event: any) => {
    let newSelectedFileIds;

    if (event.target.checked) {
      newSelectedFileIds = files.map((file: any) => file);
    } else {
      newSelectedFileIds = [];
    }

    setSelectedFileIds(newSelectedFileIds);
    onChangeSelectedFiles && onChangeSelectedFiles(newSelectedFileIds);
  };

  const handleSelectOne = (_event: any, file: IFileSystem) => {
    const selectedIndex = selectedFileIds.map((item: IFileSystem) => item.id).indexOf(file.id);

    let newSelectedFileIds: IFileSystem[] = [];

    if (selectedIndex === -1) {
      newSelectedFileIds = newSelectedFileIds.concat(selectedFileIds, file);
    } else if (selectedIndex === 0) {
      newSelectedFileIds = newSelectedFileIds.concat(selectedFileIds.slice(1));
    } else if (selectedIndex === selectedFileIds.length - 1) {
      newSelectedFileIds = newSelectedFileIds.concat(selectedFileIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedFileIds = newSelectedFileIds.concat(
        selectedFileIds.slice(0, selectedIndex),
        selectedFileIds.slice(selectedIndex + 1),
      );
    }

    setSelectedFileIds(newSelectedFileIds);

    onChangeSelectedFiles && onChangeSelectedFiles(newSelectedFileIds);
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

    if (selectedFileIds.length === 0) {
      if (selectedFiles.length > 0) {
        const newSelectedFileIds = selectedFiles.map((file: IFileSystem) => file);

        setSelectedFileIds(newSelectedFileIds);
      }
    }
  }, [limitRows, selectedFileIds.length, selectedFiles]);

  const TableRows = () => {
    const fileList = filtered.slice(page * limit, page * limit + limit).map((file: IFileSystem) => {
      return (
        <TableRow hover key={file.id} selected={selectedFileIds.findIndex((d) => d.id === file?.id) !== -1}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={
                selectedFileIds
                  .map((item: IFileSystem) => {
                    return item.id;
                  })
                  .indexOf(file.id) !== -1
              }
              onChange={(event) => handleSelectOne(event, file)}
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
              <NavLink to={`${adminPath}/app/files/${file.id}`}>
                <Typography color="textPrimary" variant="body1" key={file.id}>
                  {file.fileName}
                </Typography>
              </NavLink>
            </Box>
          </TableCell>
          <TableCell style={{ padding: '0 16px' }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <NavLink to={`${adminPath}/app/files/${file.id}`}>
                <Typography color="textPrimary" variant="body1" key={file.id}>
                  {file.path}
                </Typography>
              </NavLink>
            </Box>
          </TableCell>
          <TableCell>
            <NavLink to={`${adminPath}/app/files/${file.id}`}>
              <Typography color="textPrimary" variant="body1" key={file.id}>
                {file.company?.name}
              </Typography>
            </NavLink>
          </TableCell>
          <TableCell>{file.appSystem?.name}</TableCell>
          <TableCell>{file.producer?.name}</TableCell>
          <TableCell>{file.consumer?.name}</TableCell>
          <TableCell>{file.device?.name}</TableCell>
          <TableCell>{file.device?.id}</TableCell>
          <TableCell>{new Date(file.date || '').toLocaleString('ru', { hour12: false })}</TableCell>
          {/* <TableCell>{message.size} кб</TableCell> */}
          <TableCell>{Math.ceil(file.size).toString()} кб</TableCell>
          {/* </NavLink> */}
        </TableRow>
      );
    });

    const emptyRows = limit - Math.min(limit, files.length - page * limit);

    return (
      <>
        {fileList}
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
                    checked={selectedFileIds.length === files.length}
                    color="primary"
                    indeterminate={selectedFileIds.length > 0 && selectedFileIds.length < files.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell style={{ flexDirection: 'column' }}>
                  <Typography color="textPrimary" variant="inherit">
                    Название
                  </Typography>
                </TableCell>
                <TableCell style={{ flexDirection: 'column' }}>
                  <Typography color="textPrimary" variant="inherit">
                    Путь
                  </Typography>
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
                    Пользователь / Отправитель
                  </Typography>
                </TableCell>
                {/* <TableCell>Отправитель</TableCell> */}
                <TableCell>Получатель</TableCell>
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
                        name="fileName"
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values.fileName}
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
                        name="path"
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values.path}
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
                        name="producer"
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
                        name="consumer"
                        required
                        variant="outlined"
                        type="search"
                        value={formik.values.consumer}
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
        count={files.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default FileListTable;
