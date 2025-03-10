import { Box, Container } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

import { IDeviceLogFile, INamedEntity, ISystemFile } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import {
  IDeviceLogFileFilter,
  IDeviceLogPageParam,
  IFilterTable,
  IHeadCells,
  IListOption,
  IToolBarButton,
} from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import { deviceLogActions } from '../../store/deviceLog';
import ConfirmDialog from '../../components/ConfirmDialog';
import FileListTable from '../../components/file/FileListTable';
import { useWindowResizeWidth } from '../../utils/useWindowResizeMaxWidth';
import { companyActions } from '../../store/company';
import { userActions } from '../../store/user';
import { appSystemActions } from '../../store/appSystem';
import { bindingActions } from '../../store/deviceBinding';
import { deviceActions } from '../../store/device';

const DeviceLogFilesList = () => {
  const dispatch = useDispatch();

  const { fileList: filesList, loading, pageParams } = useSelector((state) => state.deviceLogs);

  const maxWidth = useWindowResizeWidth(0.7);

  const fetchDeviceLogFiles = useCallback(
    (logFilters?: IDeviceLogFileFilter, filterText?: string, fromRecord?: number, toRecord?: number) => {
      if (logFilters) {
        const ff: IFilterTable = Object.entries(logFilters).reduce((prev: IFilterTable, [item, value]) => {
          if (value) {
            prev[item] = value;
          }
          return prev;
        }, {});
        dispatch(deviceLogActions.fetchDeviceLogFiles(ff as IDeviceLogFileFilter, filterText, fromRecord, toRecord));
      } else {
        dispatch(deviceLogActions.fetchDeviceLogFiles(logFilters, filterText, fromRecord, toRecord));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(companyActions.fetchCompanies());
    dispatch(userActions.fetchUsers());
    dispatch(appSystemActions.fetchAppSystems());
    dispatch(deviceActions.fetchDevices());
    dispatch(bindingActions.fetchDeviceBindings());
  }, [dispatch]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchDeviceLogFiles(pageParams?.logFilters);
  }, [fetchDeviceLogFiles, pageParams?.logFilters]);

  const [formikCompany, setFormikCompany] = useState<INamedEntity | undefined>(
    // pageParams?.filesFilters?.company
    //   ? companyList.find((c) => c.name === pageParams?.filesFilters?.company)
    //   : undefined,
    undefined,
  );

  const [formikAppSystem, setFormikAppSystem] = useState<INamedEntity | undefined>(undefined);
  const [formikProducer, setFormikProducer] = useState<INamedEntity | undefined>(undefined);
  const { list: companies } = useSelector((state) => state.companies);
  const { list: appSystems } = useSelector((state) => state.appSystems);
  const { list: users } = useSelector((state) => state.users);
  const { list: devices } = useSelector((state) => state.devices);
  const { list: deviceBindings } = useSelector((state) => state.deviceBindings);

  const companyList = companies.map((d) => ({ id: d.id, name: d.name })) || [];

  const userList = companyList.length
    ? users.filter((i) => companyList.find((c) => c.id === formikCompany?.id && c.id === i.company?.id))
    : [];

  const userOASList = userList
    .filter(
      (u) =>
        !formikAppSystem ||
        u.appSystem?.id === formikAppSystem.id ||
        users.find((e) => e.appSystem?.id === formikAppSystem.id)?.id === u.erpUser?.id,
    )
    .map((d) => ({ id: d.id, name: d.name }));

  const appSystemList =
    appSystems.filter((i) => userList.find((u) => u.appSystem?.id === i.id)).map((d) => ({ id: d.id, name: d.name })) ||
    [];

  const db = deviceBindings.filter((b) => !formikProducer || b.user.id === formikProducer.id);
  const deviceList = companyList.length
    ? devices
        .filter(
          (i) =>
            companyList.find((c) => c.id === formikCompany?.id && c.id === i.company?.id) &&
            db.find((b) => b.device.id === i.id),
        )
        .map((d) => ({ id: d.id, name: d.name }))
    : [];

  const listOptions: IListOption = {
    companyId: companyList,
    appSystemId: appSystemList,
    producerId: userOASList,
    consumerId: userOASList,
    deviceId: deviceList,
    // folder: foldersList,
  };

  const [pageParamLocal, setPageParamLocal] = useState<IDeviceLogPageParam | undefined>(pageParams);

  const [filterVisible, setFilterVisible] = useState(pageParams?.logFilters ? true : false);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;
  };

  const handleSearchClick = () => {
    dispatch(deviceLogActions.setPageParam({ filterText: pageParamLocal?.filterText, page: 0 }));
    fetchDeviceLogFiles(pageParams?.logFilters ? pageParams?.logFilters : undefined, pageParamLocal?.filterText);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleSetPageParams = useCallback(
    (logPageParams: IDeviceLogPageParam) => {
      dispatch(
        deviceLogActions.setPageParam({
          logFilters: logPageParams.logFilters,
          page: logPageParams.page,
          limit: logPageParams.limit,
        }),
      );
    },
    [dispatch],
  );

  const handleFilter = useCallback(() => {
    if (filterVisible) {
      setFilterVisible(false);
      dispatch(deviceLogActions.setPageParam({ logFilters: undefined, page: 0 }));
    } else {
      setFilterVisible(true);
    }
  }, [dispatch, filterVisible]);

  const [selectedDeviceLogFileIds, setSelectedDeviceLogFileIds] = useState<IDeviceLogFile[]>([]);

  const handleSelectAll = (event: any) => {
    let newSelectedDeviceLogFileIds;

    if (event.target.checked) {
      newSelectedDeviceLogFileIds = filesList.map((deviceLogFile: any) => deviceLogFile);
    } else {
      newSelectedDeviceLogFileIds = [];
    }

    setSelectedDeviceLogFileIds(newSelectedDeviceLogFileIds);
  };

  const handleSelectOne = (_event: any, file: ISystemFile) => {
    const selectedIndex = selectedDeviceLogFileIds.map((item: IDeviceLogFile) => item.id).indexOf(file.id);

    let newSelectedDeviceLogFileIds: IDeviceLogFile[] = [];

    if (selectedIndex === -1) {
      newSelectedDeviceLogFileIds = newSelectedDeviceLogFileIds.concat(
        selectedDeviceLogFileIds,
        file as IDeviceLogFile,
      );
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
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = useCallback(() => {
    setOpen(false);
    const ids = selectedDeviceLogFileIds.map((i) => {
      return {
        id: i.id,
        appSystemId: i.appSystem?.id || '',
        companyId: i.company?.id || '',
        folder: i.folder || '',
      };
    });
    if (ids) {
      dispatch(deviceLogActions.deleteDeviceLogs(ids));
      setSelectedDeviceLogFileIds([]);
    }
  }, [dispatch, selectedDeviceLogFileIds]);

  const handleClearSearch = () => {
    dispatch(deviceLogActions.setPageParam({ filterText: '', page: 0 }));
    setPageParamLocal({ filterText: undefined });
    fetchDeviceLogFiles(pageParamLocal?.logFilters || undefined);
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchDeviceLogFiles(pageParams?.logFilters),
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

  const headCells: IHeadCells<IDeviceLogFile>[] = [
    { id: 'company', label: 'Компания', sortEnable: true, fieldName: 'name' },
    { id: 'appSystem', label: 'Подсистема', sortEnable: false, fieldName: 'name' },
    { id: 'producer', label: 'Пользователь', sortEnable: true, fieldName: 'name' },
    { id: 'device', label: 'Устройство', sortEnable: true, fieldName: 'name' },
    { id: 'uid', label: 'Номер устройства', sortEnable: true },
    { id: 'date', label: 'Дата создания', sortEnable: true, type: 'date' },
    { id: 'mdate', label: 'Дата редактирования', sortEnable: true, type: 'date' },
    { id: 'size', label: 'Размер', sortEnable: true },
  ];

  return (
    <>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        questionText={'Вы действительно хотите удалить файлы?'}
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
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
            value={(pageParamLocal?.filterText as undefined) || ''}
            clearOnClick={handleClearSearch}
            disabled={loading}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <FileListTable
                type="DeviceLog"
                headCells={headCells}
                files={filesList}
                isFilterVisible={filterVisible}
                onSubmit={fetchDeviceLogFiles}
                onDelete={handleDelete}
                onSelectMany={handleSelectAll}
                onSelectOne={handleSelectOne}
                selectedFileIds={selectedDeviceLogFileIds}
                onSetPageParams={handleSetPageParams}
                pageParams={pageParams}
                onCloseFilters={() => setFilterVisible(false)}
                setCompany={(value: INamedEntity) => setFormikCompany(value)}
                setAppSystem={(value: INamedEntity) => setFormikAppSystem(value)}
                setProducer={(value: INamedEntity) => setFormikProducer(value)}
                listOptions={listOptions}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default DeviceLogFilesList;
