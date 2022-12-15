import { useState, useEffect, useMemo } from 'react';
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
} from '@material-ui/core';

import { IFileSystem } from '@lib/types';

import { useFormik } from 'formik';

import { adminPath } from '../../utils/constants';
import { IFileFormik, IPageParam } from '../../types';

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
  pageParams?: IPageParam | undefined;
}

const FileListTable = ({
  files = [],
  onChangeSelectedFiles,
  selectedFiles = [],
  limitRows = 0,
  isFilterVisible = false,
  onSubmit,
  onSelectOne,
  onSelectMany,
  selectedFileIds,
  onSetPageParams,
  pageParams,
}: IProps) => {
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(0);

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
  const location = useLocation();

  const formik = useFormik<IFileFormik>({
    enableReinitialize: true,
    initialValues: pageParams?.filesFilters ? (pageParams?.filesFilters as IFileFormik) : initialValues,
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
      formik.values.fileName ||
      formik.values.path ||
      formik.values.appSystem ||
      formik.values.company ||
      formik.values.date ||
      formik.values.device ||
      formik.values.producer ||
      formik.values.consumer ||
      formik.values.uid
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
      );
    } else {
      return files;
    }
  }, [
    files,
    formik.values.appSystem,
    formik.values.company,
    formik.values.consumer,
    formik.values.date,
    formik.values.device,
    formik.values.fileName,
    formik.values.path,
    formik.values.producer,
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
      onSetPageParams({ filesFilters: formik.values });
    }
  }, [formik.values, initialValues, isFilterVisible, onSetPageParams]);

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

  const hlink = <Link to={`${adminPath}/app/files/123546`} />;
  const TableRows = () => {
    const fileList = filteredList.slice(page * limit, page * limit + limit).map((file: IFileSystem) => {
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

    const emptyRows = limit - Math.min(limit, filteredList.length - page * limit);

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
                    checked={selectedFileIds.length === filteredList.length}
                    color="primary"
                    indeterminate={selectedFileIds.length > 0 && selectedFileIds.length < filteredList.length}
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

export default FileListTable;
