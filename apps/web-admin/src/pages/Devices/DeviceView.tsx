import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CardHeader,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Tabs,
  Tab,
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IUser } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

import { useSelector, useDispatch } from '../../store';
import { deviceActions, deviceSelectors } from '../../store/device';
import { userActions, userSelectors } from '../../store/user';
import { codeActions, codeSelectors } from '../../store/activationCode';
import { bindingActions } from '../../store/deviceBinding';
import { IToolBarButton, IHeadCells, IPageParam, ILinkedEntity } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import SortableTable from '../../components/SortableTable';

import { adminPath, deviceStates } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';
import TabPanel from '../../components/TabPanel';

const headCells: IHeadCells<IUser>[] = [
  { id: 'name', label: 'Пользователь', sortEnable: true },
  { id: 'lastName', label: 'Фамилия', sortEnable: true },
  { id: 'firstName', label: 'Имя', sortEnable: true },
  { id: 'phoneNumber', label: 'Телефон', sortEnable: false },
  { id: 'creationDate', label: 'Дата создания', sortEnable: false },
  { id: 'editionDate', label: 'Дата редактирования', sortEnable: false },
];

export type Params = {
  id: string;
};

const DeviceView = () => {
  const { id: deviceId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.devices);

  const device = deviceSelectors.deviceById(deviceId);
  const users = userSelectors.usersByDeviceId(deviceId);
  const code = codeSelectors.activationCodeByDeviceId(deviceId);

  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const deviceDetails: ILinkedEntity[] = useMemo(
    () =>
      device
        ? [
            { id: 'Устройство', value: device },
            { id: 'Идентификатор', value: device.id },
            { id: 'Номер', value: device.uid },
            { id: 'Состояние', value: deviceStates[device.state] },
            { id: 'Код активации', value: code },
          ]
        : [],
    [device, code],
  );

  const [open, setOpen] = useState(false);

  const { pageParams } = useSelector((state) => state.users);

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const handleEdit = useCallback(() => {
    navigate(`${adminPath}/app/devices/${deviceId}/edit`);
  }, [navigate, deviceId]);

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(deviceActions.removeDevice(deviceId));
    if (res.type === 'DEVICE/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(deviceActions.fetchDeviceById(deviceId));
    dispatch(bindingActions.fetchDeviceBindings());
    dispatch(userActions.fetchUsers());
    dispatch(codeActions.fetchActivationCodes(deviceId));
  }, [dispatch, deviceId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const fetchUsers = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(userActions.fetchUsers('', filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    fetchUsers('');
  };

  const handleSearchClick = () => {
    dispatch(userActions.setPageParam({ filterText: pageParamLocal?.filterText }));
    fetchUsers(pageParamLocal?.filterText as string);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(userActions.setPageParam({ filterText: undefined }));
    setPageParamLocal({ filterText: undefined });
    fetchUsers();
  };

  const userButtons: IToolBarButton[] = [];

  const buttons: IToolBarButton[] = useMemo(() => {
    return tabValue === 0
      ? [
          {
            name: 'Обновить',
            sx: { marginRight: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: refreshData,
            icon: <CachedIcon />,
          },
          {
            name: 'Редактировать',
            sx: { marginRight: 1 },
            disabled: true,
            color: 'primary',
            variant: 'contained',
            onClick: handleEdit,
            icon: <EditIcon />,
          },
          {
            name: 'Удалить',
            disabled: true,
            color: 'secondary',
            variant: 'contained',
            onClick: handleClickOpen,
            icon: <DeleteIcon />,
          },
        ]
      : [
          {
            name: 'Обновить',
            sx: { marginRight: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: refreshData,
            icon: <CachedIcon />,
          },
        ];
  }, [handleEdit, refreshData, tabValue]);

  if (!device) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Устройство не найдено
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить устройство?</DialogContentText>
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
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'inline-flex' }}>
            <IconButton color="primary" onClick={handleCancel}>
              <ArrowBackIcon />
            </IconButton>
            <CardHeader title={'Назад'} />
            {loading && <CircularProgress size={40} />}
          </Box>
          <Box
            sx={{
              justifyContent: 'right',
            }}
          >
            <ToolBarAction buttons={buttons} />
          </Box>
        </Box>
        <Box>
          <Tabs value={tabValue} onChange={handleChangeTab}>
            <Tab label="Общая информация" />
            <Tab label="Пользователи" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <DetailsView details={deviceDetails} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <>
              <ToolbarActionsWithSearch
                buttons={userButtons}
                searchTitle={'Найти пользователя'}
                updateInput={handleUpdateInput}
                searchOnClick={handleSearchClick}
                keyPress={handleKeyPress}
                value={(pageParamLocal?.filterText as undefined) || ''}
                clearOnClick={handleClearSearch}
              />
              <Box sx={{ pt: 2 }}>
                <SortableTable<IUser> headCells={headCells} data={users} path={'/app/users/'} />
              </Box>
            </>
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default DeviceView;
