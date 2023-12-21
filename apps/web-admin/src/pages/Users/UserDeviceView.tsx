import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';

import Drawer from '@material-ui/core/Drawer';

import { SettingValue, Settings } from '@lib/types';
import { mainSettingGroup } from '@lib/store';

import { useSelector, useDispatch } from '../../store';
import bindingActions from '../../store/deviceBinding';
import deviceActions from '../../store/device';
import { ILinkedEntity, IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import deviceBindingSelectors from '../../store/deviceBinding/selectors';
import deviceSelectors from '../../store/device/selectors';

import { adminPath, deviceStates } from '../../utils/constants';

import DetailsView from '../../components/DetailsView';

import UserDeviceLog from './UserDeviceLog';

export type Params = {
  bindingid: string;
};

const UserDeviceView = () => {
  const { bindingid } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.devices);
  const deviceBinding = deviceBindingSelectors.bindingById(bindingid);
  const device = deviceSelectors.deviceById(deviceBinding?.device.id);
  const [open, setOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const deviceBindingDetails: ILinkedEntity[] = useMemo(
    () =>
      deviceBinding
        ? [
            {
              id: 'Наименование',
              value: deviceBinding.device,
              link: `${adminPath}/app/devices/${deviceBinding.device.id}`,
            },
            {
              id: 'Пользователь',
              value: deviceBinding?.user,
              link: `${adminPath}/app/users/${deviceBinding.user.id}`,
            },
            { id: 'Состояние', value: deviceStates[deviceBinding.state] },
            { id: 'Номер', value: device?.uid },
          ]
        : [],
    [device?.uid, deviceBinding],
  );

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/users/${deviceBinding?.user.id}/binding/${bindingid}/edit`);
  };

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(bindingActions.removeDeviceBinding(bindingid));
    if (res.type === 'DEVICEBINDING/REMOVE_SUCCES') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(bindingActions.fetchDeviceBindings());
    dispatch(deviceActions.fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: string, open: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const openDrawer = () => {
    {
      toggleDrawer('right', true);
    }
    return (
      <React.Fragment>
        <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
          12223485679685724
        </Drawer>
      </React.Fragment>
    );
  };

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

  if (!deviceBinding) {
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

  const goodGroup = {
    id: 'goodScan',
    name: 'Код товара',
    sortOrder: 21,
    description: 'Количество символов',
    checkSettingsCode: true,
  };
  const orderGroup = {
    id: 'orderScan',
    name: 'Код заявки',
    sortOrder: 22,
    description: 'Количество символов',
    checkSettingsCode: true,
  };

  const appSettings: Settings = {
    scannerUse: {
      id: 'scannerUse',
      sortOrder: 3,
      description: 'Использовать сканер',
      data: true,
      type: 'boolean',
      visible: true,
      group: mainSettingGroup,
    },
    addressStore: {
      id: 'addressStore',
      sortOrder: 4,
      description: 'Адресное хранение',
      data: false,
      type: 'boolean',
      visible: true,
      group: mainSettingGroup,
    },
    remainsUse: {
      id: 'remainsUse',
      sortOrder: 5,
      description: 'Использовать остатки',
      data: true,
      type: 'boolean',
      visible: true,
      group: mainSettingGroup,
      checkSettingsCode: true,
    },
    getRemains: {
      id: 'getRemains',
      sortOrder: 2,
      description: 'Запрашивать остатки',
      data: true,
      type: 'boolean',
      visible: true,
      group: mainSettingGroup,
      checkSettingsCode: true,
    },
    minBarcodeLength: {
      id: 'minBarcodeLength',
      sortOrder: 6,
      description: 'Мин. длина штрих-кода',
      data: 28,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    maxBarcodeLength: {
      id: 'maxBarcodeLength',
      sortOrder: 6,
      description: 'Макс. длина штрих-кода',
      data: 40,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    countWeight: {
      id: 'countWeight',
      sortOrder: 7,
      description: 'Вес товара, гр',
      data: 6,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    countDay: {
      id: 'countDay',
      sortOrder: 8,
      description: 'Дата (число)',
      data: 2,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    countMonth: {
      id: 'countMonth',
      sortOrder: 9,
      description: 'Дата (месяц)',
      data: 2,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    countYear: {
      id: 'countYear',
      sortOrder: 10,
      description: 'Дата (год)',
      data: 2,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    countCode: {
      id: 'countCode',
      sortOrder: 11,
      description: 'Код товара',
      data: 4,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    countQuantPack: {
      id: 'countQuantPack',
      sortOrder: 12,
      description: 'Номер взвешивания',
      data: 4,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    countNumReceived: {
      id: 'countNumReceived',
      sortOrder: 14,
      description: 'Номер партии',
      data: 6,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    boxNumber: {
      id: 'boxNumber',
      sortOrder: 15,
      description: 'Количество коробок',
      data: 0,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    boxWeight: {
      id: 'boxWeight',
      sortOrder: 16,
      description: 'Мин. вес поддона, кг',
      data: 30,
      type: 'number',
      visible: true,
      group: goodGroup,
    },
    countOrderBarcodeLentgh: {
      id: 'countOrderBarcodeLentgh',
      sortOrder: 15,
      description: 'Мин. длина штрих-кода',
      data: 15,
      type: 'number',
      visible: true,
      group: orderGroup,
    },
    countCodeDepart: {
      id: 'countCodeDepart',
      sortOrder: 16,
      description: 'Код подразделения',
      data: 3,
      type: 'number',
      visible: true,
      group: orderGroup,
    },
    countOrderDay: {
      id: 'countOrderDay',
      sortOrder: 17,
      description: 'Дата (число)',
      data: 2,
      type: 'number',
      visible: true,
      group: orderGroup,
    },
    countOrderMonth: {
      id: 'countOrderMonth',
      sortOrder: 18,
      description: 'Дата (месяц)',
      data: 2,
      type: 'number',
      visible: true,
      group: orderGroup,
    },
    countOrderYear: {
      id: 'countOrderYear',
      sortOrder: 19,
      description: 'Дата (год)',
      data: 4,
      type: 'number',
      visible: true,
      group: orderGroup,
    },
    countID: {
      id: 'countID',
      sortOrder: 20,
      description: 'Идентификатор заявки',
      data: 11,
      type: 'number',
      visible: true,
      group: orderGroup,
    },
  };

  const sotrList = (list: Settings) => {
    const arrayGroups: any[] = [];
    const callBack: string[] = [];
    let state = true;
    Object.values(list).forEach((a) => {
      if (arrayGroups.indexOf(String(a.group?.id)) == -1) arrayGroups.push(String(a.group?.id));
    });
    for (let i = 0; i < arrayGroups.length; i++) {
      Object.values(list).forEach((a) => {
        if (arrayGroups[i] == a.group?.id && state) {
          callBack.push(String(a.group?.name));
          state = false;
        }
      });
      Object.values(list).forEach((a) => {
        if (arrayGroups[i] == a.group?.id) {
          callBack[i] = callBack[i] + '____' + a.description + ': ' + a.data;
        }
      });
      state = true;
    }
    return callBack;
  };

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить привязанное устройство?</DialogContentText>
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
          <React.Fragment>
            <Button variant="contained" startIcon={<AppSettingsAltIcon />} onClick={toggleDrawer('right', true)}>
              Настройки
            </Button>
            <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
              {sotrList(appSettings)}
            </Drawer>
          </React.Fragment>
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
          <DetailsView details={deviceBindingDetails} />
        </Box>
      </Box>
      {user?.role === 'SuperAdmin' ? (
        <>
          <Box>
            <CardHeader title={'Журнал ошибок устройства пользователя'} sx={{ mx: 2 }} />
            <UserDeviceLog deviceId={device?.uid} userId={deviceBinding.user.id} />
          </Box>
        </>
      ) : null}
    </>
  );
};

export default UserDeviceView;
