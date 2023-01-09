import { Box, Container } from '@material-ui/core';

import { useCallback, useEffect, useState } from 'react';

import { IDeviceLog } from '@lib/types';

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

  // const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { logList } = useSelector((state) => state.deviceLogs);

  const fetchDeviceLogFiles = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(deviceLogActions.fetchDeviceLogFiles());
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchDeviceLogFiles();
  }, [fetchDeviceLogFiles]);

  const userLogFile = deviceLogSelectors.deviceLogByUserDeviceIds(userId, deviceId);

  const fetchDeviceLogFile = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
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

  const headCells: IHeadCells<IDeviceLog>[] = [
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
          <SortableTable<IDeviceLog> headCells={headCells} data={logList} path={'/app/deviceLogs/'} />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDeviceLog;
