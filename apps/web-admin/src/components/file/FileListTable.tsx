import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

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

import { IFileSystem } from '@lib/types';

import { useFormik } from 'formik';

import actions from '../../store/file';

import { adminPath } from '../../utils/constants';
import { IFileFilter, IFilePageParam, IPageParam } from '../../types';
import { useDispatch } from '../../store';
import { getMaxHeight } from '../../utils/helpers';
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
}

const FileListTable = ({
  files = [],
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
  height,
}: IProps) => {
  const [limit, setLimit] = useState(
    pageParams?.limit && !isNaN(Number(pageParams?.limit)) ? Number(pageParams?.limit) : 10,
  );
  const [page, setPage] = useState(pageParams?.page && !isNaN(Number(pageParams?.page)) ? Number(pageParams.page) : 0);

  const initialValues = useMemo(() => {
    return {
      path: '',
      fileName: '',
      company: '',
      appSystem: '',
      producer: '',
      consumer: '',
      device: '',
      uid: '',
      date: '',
    };
  }, []);

  const navigate = useNavigate();

  const formik = useFormik<IFileFilter>({
    enableReinitialize: true,
    initialValues: pageParams?.filesFilters || initialValues,
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
    onSetPageParams({ ...pageParams, filesFilters: formik.values, page: 0 });
    setPage(0);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

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
  //   if (isFilterVisible && formik.values !== initialValues) {
  //     setPageParamLocal({ filesFilters: formik.values });
  //   }
  // }, [formik.values, initialValues, isFilterVisible, setPageParamLocal]);

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
          <TableCell style={{ minWidth: 150 }}>{file.path}</TableCell>
          <TableCell style={{ minWidth: 500 }}>{file.fileName}</TableCell>
          <TableCell style={{ minWidth: 150 }}>{file.company?.name}</TableCell>
          <TableCell style={{ minWidth: 150 }}>{file.appSystem?.name}</TableCell>
          <TableCell style={{ minWidth: 100 }}>{file.producer?.name}</TableCell>
          <TableCell style={{ minWidth: 100 }}>{file.consumer?.name}</TableCell>
          <TableCell style={{ minWidth: 100 }}>{file.device?.name}</TableCell>
          <TableCell style={{ minWidth: 100 }}>{file.device?.id}</TableCell>
          <TableCell style={{ minWidth: 100 }}>
            {new Date(file.date || '').toLocaleString('ru', { hour12: false })}
          </TableCell>
          <TableCell style={{ minWidth: 100 }}>{Math.ceil(file.size).toString()} кб</TableCell>
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
        <Box sx={{ p: 1, overflowX: 'auto', overflowY: 'auto', maxHeight: useWindowResizeMaxHeight(getMaxHeight()) }}>
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
                <TableCell style={{ minWidth: 150 }}>Путь</TableCell>
                <TableCell style={{ minWidth: 500 }}>Название</TableCell>
                <TableCell style={{ minWidth: 150 }}>Компания</TableCell>
                <TableCell style={{ minWidth: 150 }}>Подсистема</TableCell>
                <TableCell style={{ minWidth: 100 }}>Пользователь</TableCell>
                <TableCell style={{ minWidth: 100 }}>Получатель</TableCell>
                <TableCell style={{ minWidth: 100 }}>Устройство</TableCell>
                <TableCell style={{ minWidth: 100 }}>Идентификатор</TableCell>
                <TableCell style={{ minWidth: 100 }}>Дата</TableCell>
                <TableCell style={{ minWidth: 100 }}>Размер</TableCell>
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
