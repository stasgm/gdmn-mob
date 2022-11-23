import { Box, Container } from '@material-ui/core';

import { useState } from 'react';

import { generateId } from '@lib/client-api/dist/src/utils';

import { IPageParam } from '../../types';

import { useDispatch, useSelector } from '../../store';

import DeviceBindingLogTable from '../../components/deviceBinding/DeviceBindingLogTable';

interface IProps {
  userId?: string;
  deviceId?: string;
  onAddDevice?: () => void;
}

const UserDeviceLog = ({ userId, deviceId, onAddDevice }: IProps) => {
  const dispatch = useDispatch();

  // const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const { filesList, loading, errorMessage, pageParams } = useSelector((state) => state.deviceLogs);

  const logFilesList = filesList.filter
  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false}>
        {/* <ToolbarActionsWithSearch
          buttons={deviceButtons}
          searchTitle={'Найти ошибку'}
          // valueRef={valueRef}
          updateInput={handleUpdateInput}
          searchOnClick={handleSearchClick}
          keyPress={handleKeyPress}
          value={(pageParamLocal?.filterText as undefined) || ''}
        /> */}
        <Box sx={{ pt: 2 }}>
          <DeviceBindingLogTable errors={errorList} limitRows={5} />
        </Box>
      </Container>
    </Box>
  );
};

export default UserDeviceLog;
