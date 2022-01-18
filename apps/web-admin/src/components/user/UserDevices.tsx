import { Box, Container } from '@material-ui/core';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import { IDeviceBinding } from '@lib/types';

import { useCallback, useEffect, useState } from 'react';

import { deviceBinding } from '@lib/mock';

import SortableTable from '../../components/SortableTable';

import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import actionsBinding from '../../store/deviceBinding';
import codeActions from '../../store/activationCode';
import DeviceBindingListTable from '../deviceBinding/DeviceBindingListTable';

interface IProps {
  userId: string;
  userBindingDevices: IDeviceBinding[];
  onAddDevice: () => void;
}

const UserDevices = ({ userId, userBindingDevices, onAddDevice }: IProps) => {
  const dispatch = useDispatch();
  // const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { pageParams } = useSelector((state) => state.deviceBindings);

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const { list: activationCodes } = useSelector((state) => state.activationCodes);

  const fetchDeviceBindings = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actionsBinding.fetchDeviceBindings(userId, filterText, fromRecord, toRecord));
    },
    [dispatch, userId],
  );

  const fetchActivationCodes = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
    (deviceId?: string) => {
      dispatch(codeActions.fetchActivationCodes()); //TODO Добавить фильтрацию
    },
    [dispatch],
  );
  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    // console.log('use', pageParams?.filterText);
    fetchActivationCodes();
    fetchDeviceBindings(pageParams?.filterText as string);
  }, [fetchActivationCodes, fetchDeviceBindings, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    fetchDeviceBindings('');
  };

  const handleSearchClick = () => {
    dispatch(actionsBinding.deviceBindingActions.setPageParam({ filterText: pageParamLocal?.filterText }));

    fetchDeviceBindings(pageParamLocal?.filterText as string);

    // const inputValue = valueRef?.current?.value;

    // fetchDeviceBindings(inputValue);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
    // const inputValue = valueRef?.current?.value;

    // fetchDeviceBindings(inputValue);
  };

  const handleCreateCode = (deviceId: string) => {
    dispatch(codeActions.createActivationCode(deviceId));
    fetchActivationCodes(deviceId);
  };

  const deviceButtons: IToolBarButton[] = [
    {
      name: 'Добавить',
      color: 'primary',
      variant: 'contained',
      onClick: onAddDevice,
      icon: <LibraryAddCheckIcon />,
    },
  ];

  const headCells: IHeadCells<IDeviceBinding>[] = [
    { id: 'device', label: 'Наименование', sortEnable: true },
    { id: 'state', label: 'Состояние', sortEnable: true },
    { id: 'creationDate', label: 'Дата создания', sortEnable: true },
    { id: 'editionDate', label: 'Дата редактирования', sortEnable: true },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        <ToolbarActionsWithSearch
          buttons={deviceButtons}
          searchTitle={'Найти устройство'}
          // valueRef={valueRef}
          updateInput={handleUpdateInput}
          searchOnClick={handleSearchClick}
          keyPress={handleKeyPress}
          value={(pageParamLocal?.filterText as undefined) || ''}
        />
        <Box sx={{ pt: 2 }}>
          <DeviceBindingListTable
            deviceBindings={userBindingDevices}
            activationCodes={activationCodes}
            onCreateCode={handleCreateCode}
            limitRows={5}
          />
          <SortableTable<IDeviceBinding>
            headCells={headCells}
            data={userBindingDevices}
            path={`/app/users/${deviceBinding.user.id}/binding/`}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDevices;
