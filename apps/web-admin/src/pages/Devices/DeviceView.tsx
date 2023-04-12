import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  CardHeader,
  IconButton,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IUser } from '@lib/types';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';

import { useSelector, useDispatch } from '../../store';
import deviceActions from '../../store/device';
import userActions from '../../store/user';
import codeActions from '../../store/activationCode';
import bindingActions from '../../store/deviceBinding';
import { IToolBarButton, IHeadCells, IPageParam, ILinkedEntity } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import userSelectors from '../../store/user/selectors';
import deviceSelectors from '../../store/device/selectors';
import activationCodeSelectors from '../../store/activationCode/selectors';

import SortableTable from '../../components/SortableTable';

import { adminPath, deviceStates } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';

export type Params = {
  id: string;
};

const DeviceView = () => {
  const { id: deviceId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { loading } = useSelector((state) => state.devices);

  const device = deviceSelectors.deviceById(deviceId);
  const users = userSelectors.usersByDeviceId(deviceId);
  const code = activationCodeSelectors.activationCodeByDeviceId(deviceId);

  const deviceDetails: ILinkedEntity[] = useMemo(
    () =>
      device
        ? [
            {
              id: 'Наименование',
              value: device,
            },
            {
              id: 'Номер',
              value: device?.uid,
            },
            { id: 'Состояние', value: deviceStates[device?.state] },
            { id: 'Код активации', value: code },
          ]
        : [],
    [device, code],
  );

  const [open, setOpen] = useState(false);

  const { pageParams } = useSelector((state) => state.users);

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/devices/${deviceId}/edit`);
  };

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

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    fetchUsers('');
  };

  const handleSearchClick = () => {
    dispatch(userActions.userActions.setPageParam({ filterText: pageParamLocal?.filterText }));
    fetchUsers(pageParamLocal?.filterText as string);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(userActions.userActions.setPageParam({ filterText: undefined }));
    setPageParamLocal({ filterText: undefined });
    fetchUsers();
  };

  const userButtons: IToolBarButton[] = [];

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

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { marginRight: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: refreshData,
      icon: <CachedIcon />,
    },
    {
      name: 'Редактировать',
      sx: { marginRight: 1 },
      disabled: true,
      color: 'secondary',
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
  ];

  const headCells: IHeadCells<IUser>[] = [
    { id: 'name', label: 'Пользователь', sortEnable: true },
    { id: 'lastName', label: 'Фамилия', sortEnable: true },
    { id: 'firstName', label: 'Имя', sortEnable: true },
    { id: 'phoneNumber', label: 'Телефон', sortEnable: false },
    { id: 'creationDate', label: 'Дата создания', sortEnable: false },
    { id: 'editionDate', label: 'Дата редактирования', sortEnable: false },
  ];

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
          <Box sx={{ display: 'inline-flex', marginBottom: 1 }}>
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
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
          }}
        >
          <DetailsView details={deviceDetails} />
        </Box>
      </Box>
      <Box>
        <CardHeader title={'Пользователи устройства'} sx={{ mx: 2 }} />

        <Container maxWidth={false}>
          <ToolbarActionsWithSearch
            buttons={userButtons}
            searchTitle={'Найти пользователя'}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
            value={(pageParamLocal?.filterText as undefined) || ''}
            clearOnClick={handleClearSearch}
          />
          <Box>
            <SortableTable<IUser> headCells={headCells} data={users} path={'/app/users/'} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DeviceView;
