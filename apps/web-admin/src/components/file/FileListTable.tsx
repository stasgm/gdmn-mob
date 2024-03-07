import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';

import { IFileSystem, INamedEntity } from '@lib/types';

import { Field, FormikProvider, useFormik } from 'formik';

import { X as CloseIcon } from 'react-feather';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { adminPath, fileFilterValues } from '../../utils/constants';
import { IFileFilter, IFilePageParam, IFilterObject, IFilterOption, IPageParam } from '../../types';
import { useDispatch, useSelector } from '../../store';
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';
import { getFilesFilters, getFilterObject } from '../../utils/helpers';
import ComboBox from '../ComboBox';

interface IProps {
  files: IFileSystem[];
  selectedFiles?: IFileSystem[];
  limitRows?: number;
  onChangeSelectedFiles?: (newSelectedDeviceIds: any[]) => void;
  isFilterVisible?: boolean;
  onSubmit: (values: any) => void;
  onDelete?: (ids?: string[]) => void;
  onSelectOne: (_event: any, file: IFileSystem) => void;
  onSelectMany: (event: any) => void;
  selectedFileIds: IFileSystem[];
  onSetPageParams: (filesFilters: IPageParam) => void;
  pageParams?: IFilePageParam | undefined;
  onCloseFilters?: () => void;
  onClearFilters?: () => void;
}

const FileListTable = ({
  files = [],
  isFilterVisible = false,
  onSubmit,
  onSelectOne,
  onSelectMany,
  selectedFileIds,
  onSetPageParams,
  pageParams,
  onCloseFilters,
  onClearFilters,
}: IProps) => {
  const [limit, setLimit] = useState(
    pageParams?.limit && !isNaN(Number(pageParams?.limit)) ? Number(pageParams?.limit) : 10,
  );
  const [page, setPage] = useState(pageParams?.page && !isNaN(Number(pageParams?.page)) ? Number(pageParams.page) : 0);

  const navigate = useNavigate();
  const maxHeight = useWindowResizeMaxHeight();

  const formik = useFormik<IFilterObject>({
    enableReinitialize: true,
    initialValues: pageParams?.filesFilters ? getFilterObject(pageParams?.filesFilters) : fileFilterValues,
    onSubmit: (values) => {
      onSubmit(getFilesFilters(values));
    },
  });

  const { list: companies, loading: loadingCompanies } = useSelector((state) => state.companies);
  const { list: appSystems, loading: loadingAppSystems } = useSelector((state) => state.appSystems);
  const { list: users, loading: loadingUsers } = useSelector((state) => state.users);
  const { list: devices, loading: loadingDevices } = useSelector((state) => state.devices);

  const companyList = companies.map((d) => ({ id: d.id, name: d.name })) || [];
  const appSystemList = appSystems.map((d) => ({ id: d.id, name: d.name })) || [];

  const userList = companyList.length
    ? users
        .filter((i) => companyList.find((c) => c.name === formik.values['company'].value && c.id === i.company?.id))
        .map((d) => ({ id: d.id, name: d.name }))
    : [];

  const deviceList = companyList.length
    ? devices
        .filter((i) => companyList.find((c) => c.name === formik.values['company'].value && c.id === i.company?.id))
        .map((d) => ({ id: d.id, name: d.name }))
    : [];

  const [iniit, setIniit] = useState(false);

  useEffect(() => {
    if (!isFilterVisible || iniit) {
      formik.setValues(fileFilterValues);
      setIniit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilterVisible, iniit]);

  const handleSearchClick = () => {
    onSetPageParams({ ...pageParams, filesFilters: getFilesFilters(formik.values), page: 0 });
    setPage(0);
    // onCloseFilters
  };

  const handleClearFilters = useCallback(() => {
    setIniit(true);

    formik.setValues(fileFilterValues);
    onSetPageParams({ ...pageParams, filesFilters: undefined, page: 0 });
    setPage(0);
    onClearFilters && onClearFilters();
  }, [formik, onClearFilters, onSetPageParams, pageParams]);

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

  const getFileName = (str: string) => {
    const beginIndex = str.indexOf('__');
    if (beginIndex !== -1) {
      const endIndex = str.indexOf('.json');
      return str.slice(beginIndex + 2, endIndex);
    } else {
      return str;
    }
  };

  const handleUpdateFormik = useCallback(
    (field: any, value: INamedEntity) => {
      formik.setValues({
        ...formik.values,
        [field]: { ...formik.values[field], value: value ? value.name : '' },
      });
    },
    [formik],
  );

  const TableRows = () => {
    const fileList = files.slice(page * limit, page * limit + limit).map((file: IFileSystem) => {
      return (
        <TableRow
          hover
          key={file.id}
          selected={selectedFileIds.findIndex((d) => d.id === file?.id) !== -1}
          onClick={(event) => {
            event.preventDefault();
            navigate(`${adminPath}/app/files/${file.id}`);
          }}
          sx={{
            backgroundColor: file.appSystem && file.producer && !file.device ? '#ffcfd1' : 'white',
            cursor: 'pointer',
          }}
        >
          <TableCell
            padding="checkbox"
            onClick={(event) => {
              event.stopPropagation();
              onSelectOne(event, file);
            }}
          >
            <Checkbox
              checked={
                selectedFileIds
                  .map((item: IFileSystem) => {
                    return item.id;
                  })
                  .indexOf(file.id) !== -1
              }
              value="true"
            />
          </TableCell>
          {/* {Object.values(formikList).map((item) => {
            return <TableCell>{item}</TableCell>;
          })} */}
          <TableCell>{file.folder || 'db'}</TableCell>
          <TableCell>{getFileName(file.id)}</TableCell>
          <TableCell>{file.company?.name}</TableCell>
          <TableCell>{file.appSystem?.name}</TableCell>
          <TableCell>{file.producer?.name}</TableCell>
          <TableCell>{file.consumer?.name}</TableCell>
          <TableCell>{file.device?.name}</TableCell>
          <TableCell>{file.device?.id}</TableCell>
          <TableCell>{new Date(file.date || '').toLocaleString('ru', { hour12: false })}</TableCell>
          <TableCell>{Math.ceil(file.size).toString()} кб</TableCell>
          <TableCell>{file.path}</TableCell>
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
    <FormikProvider value={formik}>
      <Card>
        <PerfectScrollbar>
          <Box
            sx={{
              p: 1,
              overflowX: 'auto',
              overflowY: 'auto',
              maxHeight,
              maxWidth: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedFileIds.length === files.length}
                      color="primary"
                      indeterminate={selectedFileIds.length > 0 && selectedFileIds.length < files.length}
                      onChange={onSelectMany}
                    />
                  </TableCell>
                  {/* {Object.keys(formikList).map((item) => {
                    return <TableCell key={item}>{item}</TableCell>;
                  })} */}
                  <TableCell>Папка</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Компания</TableCell>
                  <TableCell>Подсистема</TableCell>
                  <TableCell>Пользователь</TableCell>
                  <TableCell>Получатель</TableCell>
                  <TableCell>Устройство</TableCell>
                  <TableCell>Идентификатор</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Размер</TableCell>
                  <TableCell>Путь</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRows />
              </TableBody>
            </Table>
          </Box>
          {isFilterVisible && (
            <>
              <Divider orientation="vertical" flexItem />
              <Drawer
                ModalProps={{ disableScrollLock: true }}
                anchor="right"
                open={isFilterVisible}
                variant="persistent"
                PaperProps={{
                  sx: {
                    width: 256,
                    marginBottom: 20,
                    top: 64,
                  },
                }}
              >
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                  <Grid container direction="column" spacing={3} sx={{ p: 3, overflowY: 'auto' }}>
                    <Grid
                      sx={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                      }}
                    >
                      <IconButton sx={{ justifyContent: 'flex-end' }} onClick={onCloseFilters}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                    {/* <PerfectScrollbar> */}
                    {/* <Grid container direction="column" spacing={3} sx={{ p: 3, overflowY: 'visible' }}> */}
                    {Object.keys(fileFilterValues).map((item) => (
                      <Grid item key={item}>
                        {fileFilterValues[item].type === 'select' ? (
                          <Field
                            InputProps={{
                              sx: {
                                height: 50,
                                fontSize: 13,
                                '& .MuiOutlinedInput-input': {
                                  borderWidth: 0,
                                  // padding: 0.5,
                                },
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                              },
                            }}
                            component={ComboBox}
                            id={item}
                            name={item}
                            label={fileFilterValues[item].name || ''}
                            value={formik.values[item]?.value ? formik.values[item]?.value : ''}
                            options={
                              item === 'company'
                                ? companyList
                                : item === 'appSystem'
                                  ? appSystemList
                                  : item === 'producer' || item === 'consumer'
                                    ? userList
                                    : item === 'device'
                                      ? deviceList
                                      : []
                            }
                            setFieldValue={handleUpdateFormik}
                            setTouched={formik.setTouched}
                            fullWidth
                            getOptionLabel={(option: IFilterOption) =>
                              (formik.values[item]?.name === option.name ? option.value : option.name) || ''
                            }
                            isOptionEqualToValue={(option: INamedEntity, value: IFilterOption) => {
                              return option.name === value.value;
                            }}
                          />
                        ) : fileFilterValues[item].type === 'date' ? (
                          <LocalizationProvider
                            dateAdapter={AdapterMoment}
                            adapterLocale="ru" /* dateFormats="shortDate"*/
                          >
                            <DesktopDateTimePicker
                              label={fileFilterValues[item].name || ''}
                              // inputFormat="DD.MM.YYYY"
                              inputFormat="DD/MM/YY hh:mm"
                              value={formik.values[item]?.value || null}
                              onChange={(a, keyboardInputValue) => {
                                console.log('value', a, 'keyboardInputValue', keyboardInputValue);
                                handleUpdateFormik(item, { id: item, name: a ? new Date(a).toISOString() : '' });
                              }}
                              componentsProps={{
                                actionBar: {
                                  actions: ['clear'],
                                },
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                        ) : (
                          // </Grid>
                          <TextField
                            InputProps={{
                              sx: {
                                height: 50,
                                // fontSize: 13,
                                '& .MuiOutlinedInput-input': {
                                  borderWidth: 0,
                                  // padding: 0.5,
                                },
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                              },
                              endAdornment: formik.values[item]?.value ? (
                                <InputAdornment
                                  position="end"
                                  onClick={() => handleUpdateFormik(item, { id: item, name: '' })}
                                >
                                  <IconButton>
                                    <CloseIcon size="20" />
                                  </IconButton>
                                </InputAdornment>
                              ) : null,
                            }}
                            fullWidth
                            name={item}
                            label={fileFilterValues[item].name}
                            variant="outlined"
                            type="search"
                            value={formik.values[item]?.value}
                            onChange={(event) => handleUpdateFormik(item, { id: item, name: event.target.value })}
                            // onChange={formik.handleChange}
                          />
                        )}
                      </Grid>
                    ))}

                    <Grid item>
                      <Button
                        color="primary"
                        type="submit"
                        variant="contained"
                        // sx={{ m: 1 }}
                        fullWidth
                        onClick={handleSearchClick}
                        // disabled={!(formik.values['company'].value || formik.values['appSystem'].value)}
                      >
                        Применить
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleClearFilters}
                        // sx={{ p: 1 }}
                        fullWidth
                      >
                        Очистить
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Drawer>
            </>
          )}
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
    </FormikProvider>
  );
};

export default FileListTable;
