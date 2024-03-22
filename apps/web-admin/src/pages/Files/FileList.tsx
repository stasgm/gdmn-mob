import { Helmet } from 'react-helmet';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';

import { IFileObject, IFileSystem, INamedEntity, IUser } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import { IFileFilter, IFilePageParam, IHeadCells, IListOption, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';
import actions from '../../store/file';
import FileListTable from '../../components/file/FileListTable';
import RadioGroup from '../../components/RadioGoup';
import companyActions from '../../store/company';
import userActions from '../../store/user';
import appSystemActions from '../../store/appSystem';
import deviceActions from '../../store/device';
import { useWindowResizeWidth } from '../../utils/useWindowResizeMaxWidth';

const FileList = () => {
  const dispatch = useDispatch();

  const { list, loading, errorMessage, pageParams, folders } = useSelector((state) => state.files);

  const sortedList = useMemo(() => list.sort((a, b) => (a.path < b.path ? -1 : 1)), [list]);

  const maxWidth = useWindowResizeWidth(0.8);

  const fetchFiles = useCallback(
    (filesFilters?: IFileFilter, filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchFiles(filesFilters, filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  const fetchFolders = useCallback(
    (companyId: string, appSystemId: string) => {
      dispatch(actions.fetchFolders(companyId, appSystemId));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(companyActions.fetchCompanies());
    dispatch(userActions.fetchUsers());
    dispatch(appSystemActions.fetchAppSystems());
    dispatch(deviceActions.fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchFiles(pageParams?.filesFilters);
  }, [fetchFiles, pageParams?.filesFilters]);

  const { list: companies, loading: loadingCompanies } = useSelector((state) => state.companies);
  const { list: appSystems, loading: loadingAppSystems } = useSelector((state) => state.appSystems);
  const { list: users, loading: loadingUsers } = useSelector((state) => state.users);
  const { list: devices, loading: loadingDevices } = useSelector((state) => state.devices);

  const companyList = companies.map((d) => ({ id: d.id, name: d.name })) || [];
  const appSystemList = appSystems.map((d) => ({ id: d.id, name: d.name })) || [];

  const userList = companyList.length
    ? users
        .filter((i) => companyList.find((c) => c.name === formikCompany?.name && c.id === i.company?.id))
        .map((d) => ({ id: d.id, name: d.name }))
    : [];

  const deviceList = companyList.length
    ? devices
        .filter((i) => companyList.find((c) => c.name === formikCompany?.name && c.id === i.company?.id))
        .map((d) => ({ id: d.id, name: d.name }))
    : [];

  const foldersList = folders.map((i) => ({ id: i, name: i })) || [];

  const listOptions: IListOption = {
    company: companyList,
    appSystem: appSystemList,
    producer: userList,
    consumer: userList,
    device: deviceList,
    folder: foldersList,
  };
  useEffect(() => {
    if (pageParams?.filesFilters?.company && pageParams?.filesFilters?.appSystem) {
      const companyId = companies.find((i) => i.name === pageParams?.filesFilters?.company)?.id;
      const appSystemId = appSystems.find((i) => i.name === pageParams?.filesFilters?.appSystem)?.id;
      if (companyId && appSystemId) {
        dispatch(actions.fetchFolders(companyId, appSystemId));
      }
    }
  }, [appSystems, companies, dispatch, pageParams?.filesFilters?.appSystem, pageParams?.filesFilters?.company]);

  const [formikCompany, setFormikCompany] = useState<INamedEntity | undefined>(
    // pageParams?.filesFilters?.company
    //   ? companyList.find((c) => c.name === pageParams?.filesFilters?.company)
    //   : undefined,
    undefined,
  );

  console.log('pageParams', pageParams?.filesFilters);

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

  const handleClearFilters = () => {
    dispatch(actions.fileSystemActions.clearFilesFilters());
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
      // dispatch(actions.fileSystemActions.setPageParam({ filesFilters: undefined, page: 0 }));
    } else {
      setFilterVisible(true);
    }
  }, [filterVisible]);

  const handleDelete = useCallback(() => {
    setOpen(false);
    const ids: IFileObject[] = selectedFileIds.map((i) => {
      return {
        id: i.id,
        appSystemId: i.appSystem?.id || '',
        companyId: i.company?.id || '',
        ext: i.ext || '',
        folder: i.folder || '',
      };
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

  const [openFolder, setOpenFolder] = useState(false);

  const handleGetFolders = () => {
    if (!selectedFileIds.length) {
      dispatch(actions.fileSystemActions.setError('Файлы не выбраны'));

      return;
    }

    for (const file of selectedFileIds) {
      const inaccessibleFile = selectedFileIds.find((i) => !i.appSystem?.id || !i.company?.id);

      if (inaccessibleFile) {
        dispatch(actions.fileSystemActions.setError('Выбранные файлы недоступны для перемещения'));

        return;
      }
      const differentId = selectedFileIds.find(
        (i) => i.appSystem?.id !== file.appSystem?.id || i.company?.id !== file.company?.id,
      );

      if (differentId) {
        dispatch(actions.fileSystemActions.setError('Выбранные файлы относятся к разным подсистемам или компаниям'));

        return;
      }
    }

    setOpenFolder(true);

    const appSystemId = selectedFileIds[0].appSystem?.id;
    const companyId = selectedFileIds[0].company?.id;

    if (appSystemId && companyId) {
      fetchFolders(companyId, appSystemId);
    }
  };

  const handleCloseMovingDialog = () => {
    setOpenFolder(false);
  };

  const handleMoveFiles = () => {
    setOpenFolder(false);
    if (selectedFolder && selectedFileIds.length) {
      const ids = selectedFileIds.map((i) => {
        return {
          id: i.id,
          appSystemId: i.appSystem?.id || '',
          companyId: i.company?.id || '',
          ext: i.ext || '',
          folder: i.folder || '',
        };
      });
      dispatch(actions.moveFiles(ids, selectedFolder));
      dispatch(actions.fetchFiles());
      handleClearSearch();
    }
  };

  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);

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
      name: 'Переместить',
      sx: { mx: 1 },
      onClick: handleGetFolders,
      icon: <DriveFileMoveOutlinedIcon />,
    },
    {
      name: 'Удалить',
      sx: { mx: 1 },
      onClick: handleClickOpen,
      icon: <DeleteIcon />,
    },
  ];

  const headCells: IHeadCells<IFileSystem>[] = [
    { id: 'folder', label: 'Папка', sortEnable: true, value: 'db' },
    { id: 'id', label: 'Название', sortEnable: true },
    { id: 'company', label: 'Компания', sortEnable: true, fieldName: 'name' },
    { id: 'appSystem', label: 'Подсистема', sortEnable: false, fieldName: 'name' },
    { id: 'producer', label: 'Пользователь', sortEnable: true, fieldName: 'name' },
    { id: 'consumer', label: 'Получатель', sortEnable: true, fieldName: 'name' },
    { id: 'device', label: 'Устройство', sortEnable: true, fieldName: 'name' },
    { id: 'device', label: 'Номер устройства', sortEnable: true, fieldName: 'id' },
    { id: 'date', label: 'Дата', sortEnable: true },
    { id: 'size', label: 'Размер', sortEnable: true },
    { id: 'path', label: 'Путь', sortEnable: true },
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
      <RadioGroup
        contentText="Выберите нужную папку:"
        checked={selectedFolder || undefined}
        isOpen={openFolder}
        okLabel="Переместить"
        onCancel={handleCloseMovingDialog}
        onChange={(folder) => setSelectedFolder(folder)}
        onClose={handleCloseMovingDialog}
        onOk={handleMoveFiles}
        values={folders}
      />
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          maxWidth: filterVisible ? maxWidth : '100%',
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
                headCells={headCells}
                files={sortedList}
                isFilterVisible={filterVisible}
                onSubmit={fetchFiles}
                onDelete={handleDelete}
                onSelectMany={handleSelectAll}
                onSelectOne={handleSelectOne}
                selectedFileIds={selectedFileIds}
                onSetPageParams={handleSetPageParams}
                pageParams={pageParams}
                onCloseFilters={() => setFilterVisible(false)}
                company={formikCompany}
                setCompany={(value: INamedEntity) => setFormikCompany(value)}
                listOptions={listOptions}
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
