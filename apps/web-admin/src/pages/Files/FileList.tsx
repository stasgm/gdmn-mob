import { Helmet } from 'react-helmet';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

import { IFileSystem } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import { IFileFilter, IHeadCells, IFilePageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';
import actions from '../../store/file';
import FileListTable from '../../components/file/FileListTable';

const FileList = () => {
  const dispatch = useDispatch();

  const { list, loading, errorMessage, pageParams } = useSelector((state) => state.files);

  const sortedList = useMemo(() => list.sort((a, b) => (a.path < b.path ? -1 : 1)), [list]);
  const fetchFiles = useCallback(
    (filesFilters?: IFileFilter, filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchFiles(filesFilters, filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchFiles(pageParams?.filesFilters);
  }, [fetchFiles, pageParams?.filesFilters]);

  const [pageParamLocal, setPageParamLocal] = useState<IFilePageParam | undefined>(pageParams);

  const [filterVisible, setFilterVisible] = useState(pageParams?.filesFilters ? true : false);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    // fetchDevices('');
  };

  useEffect(() => {
    if (pageParams?.filesFilters) {
      fetchFiles(pageParams?.filesFilters);
    }
  }, [fetchFiles, pageParams?.filesFilters]);

  const handleSearchClick = () => {
    dispatch(actions.fileSystemActions.setPageParam({ filterText: pageParamLocal?.filterText, page: 0 }));
    fetchFiles(pageParamLocal?.filesFilters ? pageParamLocal?.filesFilters : undefined, pageParamLocal?.filterText);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearError = () => {
    dispatch(actions.fileSystemActions.clearError());
  };

  const [selectedFileIds, setSelectedFileIds] = useState<IFileSystem[]>([]);

  const handleSelectAll = (event: any) => {
    let newSelectedFileIds;

    if (event.target.checked) {
      newSelectedFileIds = sortedList.map((file: any) => file);
    } else {
      newSelectedFileIds = [];
    }

    setSelectedFileIds(newSelectedFileIds);
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
  };

  // useEffect(() => {
  //   // if (limitRows > 0) {
  //   //   setLimit(limitRows);
  //   // }

  //   if (selectedFileIds.length === 0) {
  //     if (selectedFiles.length > 0) {
  //       const newSelectedFileIds = selectedFiles.map((file: IFileSystem) => file);

  //       setSelectedFileIds(newSelectedFileIds);
  //     }
  //   }
  // }, [selectedFileIds.length, selectedFiles]);

  const handleSetPageParams = useCallback(
    (pageParams: IFilePageParam) => {
      dispatch(
        actions.fileSystemActions.setPageParam({
          filesFilters: pageParams.filesFilters,
          page: pageParams.page,
          limit: pageParams.limit,
        }),
      );
    },
    [dispatch],
  );

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFilter = useCallback(() => {
    if (filterVisible) {
      setFilterVisible(false);
      dispatch(actions.fileSystemActions.setPageParam({ filesFilters: undefined, page: 0 }));
    } else {
      setFilterVisible(true);
    }
  }, [dispatch, filterVisible]);

  const handleDelete = useCallback(() => {
    setOpen(false);
    const ids = selectedFileIds.map((i) => {
      return i.id;
    });
    if (ids) {
      dispatch(actions.removeFiles(ids));
      setSelectedFileIds([]);
    }
  }, [dispatch, selectedFileIds]);

  const handleClearSearch = () => {
    dispatch(actions.fileSystemActions.setPageParam({ filterText: undefined }));
    setPageParamLocal({ filterText: undefined });
    fetchFiles(pageParamLocal?.filesFilters || undefined);
    dispatch(actions.fileSystemActions.setPageParam({ page: 0 }));
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchFiles(pageParams?.filesFilters),
      icon: <CachedIcon />,
    },
    {
      name: 'Фильтр',
      sx: { mx: 1 },
      onClick: handleFilter,
      icon: <FilterIcon />,
    },
    {
      name: 'Удалить',
      sx: { mx: 1 },
      onClick: handleClickOpen,
      icon: <DeleteIcon />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Файловая система</title>
      </Helmet>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить файлы?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary" variant="contained">
              Удалить
            </Button>
            <Button onClick={handleClose} color="secondary" variant="contained">
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <ToolbarActionsWithSearch
            buttons={buttons}
            searchTitle={'Найти файл'}
            //valueRef={valueRef}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
            value={(pageParamLocal?.filterText as undefined) || ''}
            clearOnClick={handleClearSearch}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <FileListTable
                files={sortedList}
                isFilterVisible={filterVisible}
                onSubmit={fetchFiles}
                onDelete={handleDelete}
                onSelectMany={handleSelectAll}
                onSelectOne={handleSelectOne}
                selectedFileIds={selectedFileIds}
                onSetPageParams={handleSetPageParams}
                pageParams={pageParams}
              />
            </Box>
            // <Box sx={{ pt: 2 }}>
            //   <SortableFilterTable<IDeviceLogFiles>
            //     headCells={headCells}
            //     data={filesList}
            //     path={'/app/deviceLogs/'}
            //     isFiltered={filterVisible}
            //   />
            // </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default FileList;
