import { Box, Container } from '@mui/material';

import { useCallback, useEffect } from 'react';

import { IDeviceLogEntry } from '@lib/types';

import { IHeadCells } from '../../types';

import { useDispatch, useSelector } from '../../store';

import deviceLogSelectors from '../../store/deviceLog/selectors';
import deviceLogActions from '../../store/deviceLog';
import SortableTable from '../../components/SortableTable';

interface IProps {
  userId?: string;
  deviceId?: string;
}

const UserDeviceLog = ({ userId, deviceId }: IProps) => {
  const dispatch = useDispatch();

  const { deviceLog } = useSelector((state) => state.deviceLogs);

  const fetchDeviceLogFiles = useCallback(
    (_filterText?: string, _fromRecord?: number, _toRecord?: number) => {
      dispatch(deviceLogActions.fetchDeviceLogFiles());
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchDeviceLogFiles();
  }, [fetchDeviceLogFiles]);

  const userLogFile = deviceLogSelectors.deviceLogFileByUserAndDevice(userId, deviceId);

  const fetchDeviceLogFile = useCallback(
    (_filterText?: string, _fromRecord?: number, _toRecord?: number) => {
      if (userLogFile) {
        dispatch(deviceLogActions.fetchDeviceLog(userLogFile?.id));
      }
    },
    [dispatch, userLogFile],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchDeviceLogFile();
  }, [fetchDeviceLogFile, userLogFile?.id]);

  const headCells: IHeadCells<IDeviceLogEntry>[] = [
    { id: 'name', label: 'Функция', sortEnable: true, filterEnable: true },
    { id: 'message', label: 'Сообщение', sortEnable: true, filterEnable: true },
    { id: 'date', label: 'Дата', sortEnable: true, filterEnable: true },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        <Box sx={{ pt: 2 }}>
          <SortableTable<IDeviceLogEntry> headCells={headCells} data={deviceLog} path={'/app/deviceLogs/'} />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDeviceLog;
