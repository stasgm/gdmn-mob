import { Box } from '@mui/material';

import { IDeviceLogEntry } from '@lib/types';

import { IHeadCells } from '../../types';

import SortableTable from '../../components/SortableTable';

interface IProps {
  deviceLog: IDeviceLogEntry[];
}

const headCells: IHeadCells<IDeviceLogEntry>[] = [
  { id: 'name', label: 'Функция', sortEnable: true, filterEnable: true },
  { id: 'message', label: 'Сообщение', sortEnable: true, filterEnable: true },
  { id: 'date', label: 'Дата', sortEnable: true, filterEnable: true },
];

const UserDeviceLog = ({ deviceLog }: IProps) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <SortableTable<IDeviceLogEntry> headCells={headCells} data={deviceLog} path={'/app/deviceLogs/'} />
    </Box>
  );
};

export default UserDeviceLog;
