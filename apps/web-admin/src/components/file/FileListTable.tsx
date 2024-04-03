import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
  TableSortLabel,
  TextField,
} from '@mui/material';

import { IEntity, INamedEntity, ISystemFile } from '@lib/types';

import { Field, FormikProvider, useFormik } from 'formik';

import { X as CloseIcon } from 'react-feather';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { adminPath, fileFilterValues } from '../../utils/constants';
import { IFilePageParam, IFilterObject, IFilterOption, IHeadCells, IListOption, IPageParam } from '../../types';
import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';
import { useWindowResizeWidth } from '../../utils/useWindowResizeMaxWidth';
import { getFilesFilters, getFilterObject } from '../../utils/helpers';
import ComboBox from '../ComboBox';
// import { useDrawerResizeMaxHeight } from '../../utils/useDrawerResizeMaxHeight';

type Order = 'asc' | 'desc';

interface IProps<T extends IEntity> {
  headCells: IHeadCells<T>[];
  files: ISystemFile[];
  selectedFiles?: ISystemFile[];
  limitRows?: number;
  onChangeSelectedFiles?: (newSelectedDeviceIds: any[]) => void;
  isFilterVisible?: boolean;
  onSubmit: (values: any) => void;
  onDelete?: (ids?: string[]) => void;
  onSelectOne: (_event: any, file: ISystemFile) => void;
  onSelectMany: (event: any) => void;
  selectedFileIds: ISystemFile[];
  onSetPageParams: (filesFilters: IPageParam) => void;
  pageParams?: IFilePageParam | undefined;
  onCloseFilters?: () => void;
  onClearFilters?: () => void;
  setCompany: (value: INamedEntity) => void;
  listOptions: IListOption;
}

// const FileListTable: T = ({
function FileListTable<T extends IEntity>({
  files = [],
  headCells = [],

  // onChangeSelectedFiles,
  // selectedFiles = [],
  // limitRows = 0,
  isFilterVisible = false,
  onSubmit,
  onSelectOne,
  onSelectMany,
  selectedFileIds,
  onSetPageParams,
  pageParams,
  onCloseFilters,
  onClearFilters,
  setCompany,
  listOptions,
}: IProps<T>) {
  // }: IProps<T>) => {
  const [limit, setLimit] = useState(
    pageParams?.limit && !isNaN(Number(pageParams?.limit)) ? Number(pageParams?.limit) : 10,
  );
  const [page, setPage] = useState(pageParams?.page && !isNaN(Number(pageParams?.page)) ? Number(pageParams.page) : 0);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(); //headCells[0].id

  const navigate = useNavigate();
  const maxHeight = useWindowResizeMaxHeight();
  const width = useWindowResizeWidth(0.2);

  // const drawerHeight = useDrawerResizeMaxHeight();

  const formik = useFormik<IFilterObject>({
    enableReinitialize: true,
    initialValues: pageParams?.filesFilters ? getFilterObject(pageParams?.filesFilters) : fileFilterValues,
    onSubmit: (values) => {
      onSubmit(getFilesFilters(values));
    },
  });

  const handleSearchClick = () => {
    onSetPageParams({ ...pageParams, filesFilters: getFilesFilters(formik.values), page: 0 });
    setPage(0);
    // onCloseFilters
  };

  const handleClearFilters = useCallback(() => {
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
  //       const newSelectedFileIds = selectedFiles.map((file: ISystemFile) => file);

  //       setSelectedFileIds(newSelectedFileIds);
  //     }
  //   }
  // }, [limitRows, selectedFileIds.length, selectedFiles]);4

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
        [field]: {
          ...formik.values[field],
          value: value ? (formik.values[field].type === 'select' ? value.id : value.name) : '',
        },
      });
      if (field === 'companyId' && value) {
        setCompany(value);
      }
    },
    [formik, setCompany],
  );

  const handleSortRequest = (cellId: keyof T) => {
    const isAsc = orderBy === cellId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(cellId);
  };

  function descendingComparator<T>(a: T, b: T, o: keyof T) {
    if (b[o] < a[o]) {
      return -1;
    }
    if (b[o] > a[o]) {
      return 1;
    }
    if (!b[o]) {
      return -1;
    }
    if (!a[o]) {
      return 1;
    }
    return 0;
  }

  function comporator<T>(a: T, b: T, ord: keyof T) {
    return order === 'desc' ? descendingComparator(a, b, ord) : -descendingComparator(a, b, ord);
  }

  function SortedTableRows<T>(array: T[]) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comporator<T>(a[0], b[0], orderBy as keyof T);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function DeserializeProp<T>(propName: keyof T, value: any, fieldName?: string) {
    /** Если в наименовании содержится цифра, то значение преобразоывается в дату */
    if (!value) {
      return '';
    } else {
      if (propName === 'name') return value;

      if (propName === 'id') return getFileName(value);

      // if (typeof value === 'object' && 'name' in value) {
      //   return value.name;
      // }

      if (fieldName) {
        return value[fieldName];
      }

      // if (propName === 'state') {
      //   return deviceStates[value as DeviceState];
      // } // для поля Состояние в устройстве

      if (propName === 'size') {
        return `${Math.ceil(value).toString()} кб`;
      } // для поля Размер в файлах и логах

      if (!isNaN(new Date(value).getDate())) {
        return new Date(value || '').toLocaleString('ru', { hour12: false });
      }

      return value;
    }
  }

  const getValue = (id: string | INamedEntity, data?: INamedEntity[]) => {
    // console.log('data', data, 'id', id);
    // console.log('data.find((i) => i.id === id)?.name || ', data?.find((i) => i.id === id)?.name || '');
    return data?.find((i) => i.id === id)?.name || '';
  };

  const TableRows = () => {
    const fileList = SortedTableRows(/*<T>*/ files)
      .slice(page * limit, page * limit + limit)
      .map((file: ISystemFile) => {
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
                    .map((item: ISystemFile) => {
                      return item.id;
                    })
                    .indexOf(file.id) !== -1
                }
                value="true"
              />
            </TableCell>
            {headCells.map((item) => {
              return (
                <TableCell key={item.label}>
                  {DeserializeProp<T>(item.id, file[item.id as string] || item.value, item.fieldName || '')}
                </TableCell>
              );
            })}
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
              // maxWidth: '100%',
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
                  {headCells.map((item) => {
                    return (
                      <TableCell key={item.label} sortDirection={orderBy === item.id ? order : false}>
                        <TableSortLabel
                          active={orderBy === item.id}
                          direction={orderBy === item.id ? order : 'asc'}
                          onClick={item.sortEnable ? () => handleSortRequest(item.id) : undefined}
                        >
                          {item.label}
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRows />
              </TableBody>
            </Table>
          </Box>
          {isFilterVisible && (
            <Box>
              <Divider orientation="vertical" flexItem />
              <Drawer
                // ModalProps={{ disableScrollLock: true }}
                anchor="right"
                open={isFilterVisible}
                variant="persistent"
                PaperProps={{
                  sx: {
                    top: 64,
                    width,
                    // paddingBottom: 5,
                    // overflow: 'visible',
                    // height: drawerHeight,
                    // maxHeight: drawerHeight,
                    height: 'calc(100% - 64px)',
                    transitionProperty: 'width, transform !important',
                    transitionDuration: '0.3s !important',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 1, 1) !important',
                  },
                }}
              >
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                  <Box
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}
                    maxHeight={'5%'}
                  >
                    <IconButton sx={{ justifyContent: 'flex-end' }} onClick={onCloseFilters}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box
                    // maxHeight={'85%'}
                    sx={{
                      p: 3,
                      /*overflowY: 'scroll',*/ flexDirection: 'column',
                      // maxHeight: '85%',
                      overflowY: 'auto',
                    }}
                  >
                    {Object.keys(fileFilterValues).map((item) => (
                      <Grid item key={item} marginBottom={3}>
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
                            value={
                              formik.values[item]?.value ? getValue(formik.values[item]?.value, listOptions[item]) : ''
                            }
                            options={listOptions[item] || []}
                            setFieldValue={handleUpdateFormik}
                            setTouched={formik.setTouched}
                            error={Boolean(formik.touched[item] && formik.errors[item])}
                            fullWidth
                            getOptionLabel={
                              (option: IFilterOption) =>
                                (formik.values[item]?.name === option.name
                                  ? getValue(option.value, listOptions[item])
                                  : option.name) || ''
                              // (formik.values[item]?.name === option.name ? option.value : option.name) || ''
                            }
                            isOptionEqualToValue={(option: INamedEntity, value: IFilterOption) =>
                              option.name === getValue(value.value, listOptions[item])
                            }
                            disabled={item === 'companyId' ? false : !formik.values['companyId'].value}
                          />
                        ) : fileFilterValues[item].type === 'date' ? (
                          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="ru">
                            <DesktopDateTimePicker
                              label={fileFilterValues[item].name || ''}
                              inputFormat="DD/MM/YY hh:mm"
                              value={(formik.values[item]?.value as string) || null}
                              onChange={(date) =>
                                handleUpdateFormik(item, { id: item, name: date ? new Date(date).toISOString() : '' })
                              }
                              componentsProps={{
                                actionBar: {
                                  actions: ['clear'],
                                },
                              }}
                              renderInput={(params) => <TextField {...params} fullWidth />}
                              disabled={!formik.values['companyId'].value}
                            />
                          </LocalizationProvider>
                        ) : (
                          <TextField
                            InputProps={{
                              sx: {
                                height: 50,
                                '& .MuiOutlinedInput-input': { borderWidth: 0 },
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
                            type="text"
                            value={formik.values[item]?.value}
                            onChange={(event) => handleUpdateFormik(item, { id: item, name: event.target.value })}
                            disabled={!formik.values['companyId'].value}
                            error={Boolean(formik.touched[item] && formik.errors[item])}
                          />
                        )}
                      </Grid>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      p: 3,
                      flexDirection: 'row',
                      maxHeight: '10%',
                      justifyContent: 'space-between',
                      // minWidth: '100%',
                      display: 'flex',
                    }}
                  >
                    {/* <Grid item> */}
                    {/* sx={{maxWidth: '50%'}} */}
                    <Box>
                      <Button
                        color="primary"
                        type="submit"
                        variant="contained"
                        // sx={{ m: 1 }}
                        // fullWidth
                        onClick={handleSearchClick}
                      >
                        Применить
                      </Button>
                    </Box>
                    {/* </Grid> */}
                    {/* <Grid item> */}
                    <Box /*sx={{ paddingRight: 2 }}*/>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleClearFilters}
                        // fullWidth
                      >
                        Очистить
                      </Button>
                    </Box>
                    {/* </Grid> */}
                  </Box>
                </form>
              </Drawer>
            </Box>
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
}

export default FileListTable;
