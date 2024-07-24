import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
} from '@mui/material';

import { IFileSystem, INamedEntity } from '@lib/types';

import { Field, FormikProvider, useFormik } from 'formik';

import { X as CloseIcon } from 'react-feather';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import ComboBox from '../ComboBox';

import actions from '../../store/file';

import { adminPath, fileFilterValues, fileFiltersDescription } from '../../utils/constants';
import { IFileFilter, IFilePageParam, IFilterObject, IFilterOption, IPageParam } from '../../types';
import { useDispatch, useSelector } from '../../store';
import { getFilesFilters, getFilterObject } from '../../utils/helpers';
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

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
  height?: number | undefined;
  onCloseFilters?: () => void;
  onClearFilters?: () => void;
  // onSetFilterVisible?: () => void;
}

const FileListTable = ({
  files = [],
  // onChangeSelectedFiles,
  // selectedFiles = [],
  // limitRows = 0,
  isFilterVisible = false,
  // onSetFilterVisible,
  onSubmit,
  onSelectOne,
  onSelectMany,
  selectedFileIds,
  onSetPageParams,
  pageParams,
  height,
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
      console.log('values', values);
      onSubmit(getFilesFilters(values));
    },
    // onReset: () => {
    //   onSetPageParams({ ...pageParams, filesFilters: undefined, page: 0 });

    //   onClearFilters && onClearFilters();
    //   formik.setValues(fileFilterValues);
    // },
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

  // console.log('usersList', usersList);

  const isAuto = (item: string) =>
    item === 'company' || item === 'appSystem' || item === 'producer' || item === 'consumer' || item === 'device';

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
    // console.log('123');
    setIniit(true);
    formik.setValues(fileFilterValues);
    onSetPageParams({ ...pageParams, filesFilters: undefined, page: 0 });
    setPage(0);
    onClearFilters && onClearFilters();
  }, [formik, onClearFilters, onSetPageParams, pageParams]);

  // const handleKeyPress = (key: string) => {
  //   if (key !== 'Enter') return;

  //   handleSearchClick();
  // };

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

  // useEffect(() => {
  //   if (isFilterVisible && formik.values !== fileFilterValues) {
  //     setPageParamLocal({ filesFilters: formik.values });
  //   }
  // }, [formik.values, fileFilterValues, isFilterVisible, setPageParamLocal]);

  // useEffect(() => {
  //   if (limitRows > 0) {
  //     setLimit(limitRows);
  //   }

  //   if (selectedFileIds.length === 0) {
  //     if (selectedFiles.length > 0) {
  //       const newSelectedFileIds = selectedFiles.map((file: IFileSystem) => file);

  //       setSelectedFileIds(newSelectedFileIds);
  //     }
  //   }
  // }, [limitRows, selectedFileIds.length, selectedFiles]);

  const getFileName = (str: string) => {
    const beginIndex = str.indexOf('__');
    if (beginIndex !== -1) {
      const endIndex = str.indexOf('.json');
      return str.slice(beginIndex + 2, endIndex);
    } else {
      return str;
    }
  };

  // console.log('formik,', formik.values);

  const handleUpdateFormik = useCallback(
    (field: any, value: INamedEntity) => {
      // console.log('field', field, 'value', value);
      formik.setValues({
        ...formik.values,
        [field]: { ...formik.values[field], value: value.name },
      });
    },
    [formik],
  );

  const TableRows = () => {
    const fileList = files.slice(page * limit, page * limit + limit).map((file: IFileSystem) => {
      // const b = ;
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
          <TableCell /*style={{ minWidth: 150 }}*/>{file.folder || 'db'}</TableCell>
          <TableCell /*style={{ minWidth: 500 }}*/>{getFileName(file.id)}</TableCell>
          <TableCell /*style={{ minWidth: 150 }}*/>{file.company?.name}</TableCell>
          <TableCell /*style={{ minWidth: 150 }}*/>{file.appSystem?.name}</TableCell>
          <TableCell /*style={{ minWidth: 100 }}*/>{file.producer?.name}</TableCell>
          <TableCell /*style={{ minWidth: 100 }}*/>{file.consumer?.name}</TableCell>
          <TableCell /*style={{ minWidth: 100 }}*/>{file.device?.name}</TableCell>
          <TableCell /*style={{ minWidth: 100 }}*/>{file.device?.id}</TableCell>
          <TableCell /*style={{ minWidth: 100 }}*/>
            {new Date(file.date || '').toLocaleString('ru', { hour12: false })}
          </TableCell>
          <TableCell /*style={{ minWidth: 100 }}*/>{Math.ceil(file.size).toString()} кб</TableCell>
          <TableCell /*style={{ minWidth: 150 }}*/>{file.path}</TableCell>
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

  const [ddate, setDate] = useState(new Date());

  console.log('formik VALUES', formik.values);
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
                            value={formik.values[item].value ? formik.values[item].value : ''}
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
                            // error={Boolean(formik.touched.company && formik.errors.company)}
                            // disabled={/* loading || */ loadingCompanies}
                            fullWidth
                            getOptionLabel={(option: IFilterOption) =>
                              (formik.values[item].name === option.name ? option.value : option.name) || ''
                            }
                            isOptionEqualToValue={(option: INamedEntity, value: IFilterOption) => {
                              // console.log('option.nam', option, 'value', value);
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
                              value={formik.values[item].value || null}
                              onChange={(a, keyboardInputValue) => {
                                console.log('value', a, 'keyboardInputValue', keyboardInputValue);
                                handleUpdateFormik(item, { id: item, name: new Date(a).toISOString() });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  // InputProps={{
                                  //   endAdornment: formik.values.dateTo.value ? (
                                  //     <InputAdornment position="end" onClick={clearOnClick}>
                                  //       <IconButton>
                                  //         <CloseIcon fontSize="small" />
                                  //       </IconButton>
                                  //     </InputAdornment>
                                  //   ) : null,
                                  // }}
                                />
                              )}
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
                            }}
                            fullWidth
                            name={item}
                            label={fileFilterValues[item].name}
                            variant="outlined"
                            type="search"
                            value={formik.values[item].value}
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
                        disabled={!(formik.values['company'].value || formik.values['appSystem'].value)}
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
          // sx={{ maxWidth: isFilterVisible ? '70%' : '100%' }}
        />
      </Card>
    </FormikProvider>
  );
};

export default FileListTable;
