import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import CachedIcon from '@material-ui/icons/Cached';

import { generateId } from '@lib/client-api/dist/src/utils';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device';
import processActions from '../../store/process';
import companyActions from '../../store/company';
import { deviceLogFiles, IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';
import ProcessListTable from '../../components/process/ProcessListTable';
import DeviceLogsListTable from '../../components/deviceLogs/DeviceLogsListTable';

const DeviceLogsList = () => {
  const dispatch = useDispatch();

  const { list: processes, loading, errorMessage, pageParams } = useSelector((state) => state.processes);
  const companies = useSelector((state) => state.companies.list);

  const messageList: deviceLogFiles[] = [
    {
      appSystem: {
        id: '5c66190ef4',
        name: 'gdmn-sales-representative',
      },
      company: { id: 'a60dfec9cf', name: 'Company' },
      contact: {
        id: '407436c548',
        name: 'User',
      },
      id: generateId(),

      date: new Date().toISOString(),
      device: { id: 'b8a193619c', name: 'Android' },
      path: 'r6c391349b_from_d5cf297beb_to_407436c548_dev_b8a193619c.json',
      size: '0.04',
    },
    {
      appSystem: {
        id: '5c66190ef4',
        name: 'gdmn-sales-representative',
      },
      company: { id: 'a60dfec9cf', name: 'Company' },
      contact: {
        id: '495079182b',
        name: 'User1',
      },
      id: generateId(),

      date: new Date().toISOString(),
      device: { id: 'f39a2e5af4', name: 'Xiaomi' },
      path: '78dj2q940a_from_d5cf297beb_to_495079182b_dev_f39a2e5af4.json',
      size: '0.04',
    },
    {
      appSystem: {
        id: '5c66190ef4',
        name: 'gdmn-sales-representative',
      },
      id: generateId(),
      company: { id: 'a60dfec9cf', name: 'Company' },
      contact: {
        id: 'e3dfc0ae8f',
        name: 'User2',
      },
      date: new Date().toString(),
      device: { id: '7a403b958a', name: 'iphone' },
      path: 'd6c330949b_from_d5cf297beb_to_e3dfc0ae8f_dev_7a403b958a.json',
      size: '0.04',
    },

    {
      id: '32b23af795',
      company: {
        id: 'a481a7c0-1aeb-11ec-8f86-395fc49b2922',
        name: 'Бройлерная птицефабрика',
      },
      appSystem: {
        id: 'e5a7ca30-c7cb-11ec-b6db-ed9e2491e4fd',
        name: 'gdmn-sales-representative',
      },
      contact: {
        id: '89ebee20-1aeb-11ec-8f86-395fc49b2922',
        name: 'admin',
      },
      device: {
        id: '003b0820-6c8d-11ec-9200-b37a986cab43',
        name: 'dr',
      },
      // eslint-disable-next-line max-len
      path: 'C:\\d\\.DB\\DB_a481a7c0-1aeb-11ec-8f86-395fc49b2922\\gdmn-sales-representative\\deviceLogs\\from_89ebee20-1aeb-11ec-8f86-395fc49b2922_dev_003b0820-6c8d-11ec-9200-b37a986cab43.json',
      date: 'Fri Nov 11 2022 13:58:03 GMT+0300 (Москва, стандартное время)',
      size: '0.0018939971923828125',
    },
    {
      id: 'b24467fec2',
      company: {
        id: 'a481a7c0-1aeb-11ec-8f86-395fc49b2922',
        name: 'Бройлерная птицефабрика',
      },
      appSystem: {
        id: 'e5a7ca30-c7cb-11ec-b6db-ed9e2491e4fd',
        name: 'gdmn-sales-representative',
      },
      contact: {
        id: '89ebee20-1aeb-11ec-8f86-395fc49b2922',
        name: 'admin',
      },
      device: {
        id: 'fbdcefc0-1aeb-11ec-8f86-395fc49b2922',
        name: 'gdmn',
      },
      // eslint-disable-next-line max-len
      path: 'C:\\d\\.DB\\DB_a481a7c0-1aeb-11ec-8f86-395fc49b2922\\gdmn-sales-representative\\deviceLogs\\from_89ebee20-1aeb-11ec-8f86-395fc49b2922_dev_fbdcefc0-1aeb-11ec-8f86-395fc49b2922.json',
      date: 'Wed Nov 16 2022 14:15:29 GMT+0300 (Москва, стандартное время)',
      size: '0.0009479522705078125',
    },
    {
      id: 'eb0c06393b',
      company: {
        id: 'a481a7c0-1aeb-11ec-8f86-395fc49b2923',
        name: 'птицефабрика',
      },
      appSystem: {
        id: 'e5a7ca30-c7cb-11ec-b6db-ed9e2491e4fd',
        name: 'gdmn-sales-representative',
      },
      contact: {
        id: '89ebee20-1aeb-11ec-8f86-395fc49b2922',
        name: 'admin',
      },
      device: {
        id: '003b0820-6c8d-11ec-9200-b37a986cab43',
        name: 'dr',
      },
      // eslint-disable-next-line max-len
      path: 'C:\\d\\.DB\\DB_a481a7c0-1aeb-11ec-8f86-395fc49b2923\\gdmn-sales-representative\\deviceLogs\\from_89ebee20-1aeb-11ec-8f86-395fc49b2922_dev_003b0820-6c8d-11ec-9200-b37a986cab43.json',
      date: 'Tue Nov 15 2022 13:23:01 GMT+0300 (Москва, стандартное время)',
      size: '0.0018939971923828125',
    },
    {
      id: 'e8ee9d04ad',
      company: {
        id: 'a481a7c0-1aeb-11ec-8f86-395fc49b2923',
        name: 'птицефабрика',
      },
      appSystem: {
        id: 'e5a7ca30-c7cb-11ec-b6db-ed9e2491e4fd',
        name: 'gdmn-sales-representative',
      },
      contact: {
        id: '89ebee20-1aeb-11ec-8f86-395fc49b2922',
        name: 'admin',
      },
      device: {
        id: 'ff824cdfa6',
        name: 'dev5',
      },
      // eslint-disable-next-line max-len
      path: 'C:\\d\\.DB\\DB_a481a7c0-1aeb-11ec-8f86-395fc49b2923\\gdmn-sales-representative\\deviceLogs\\from_89ebee20-1aeb-11ec-8f86-395fc49b2922_dev_ff824cdfa6.json',
      date: 'Tue Nov 15 2022 18:31:43 GMT+0300 (Москва, стандартное время)',
      size: '0.0018939971923828125',
    },
  ];

  const fetchProcesses = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(processActions.fetchProcesses(filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchProcesses(pageParams?.filterText as string);
  }, [fetchProcesses, pageParams?.filterText]);

  const fetchCompanies = useCallback(async () => {
    await dispatch(companyActions.fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const valueRef = useRef<HTMLInputElement>(null); // reference to TextField

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    // fetchDevices('');
  };

  const handleSearchClick = () => {
    dispatch(actions.deviceActions.setPageParam({ filterText: pageParamLocal?.filterText }));
    fetchProcesses(pageParamLocal?.filterText as string);

    // const inputValue = valueRef?.current?.value;
    // fetchDevices(inputValue);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
    // const inputValue = valueRef?.current?.value;
    // fetchDevices(inputValue);
  };

  const handleClearError = () => {
    dispatch(actions.deviceActions.clearError());
  };

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: () => fetchProcesses(),
      icon: <CachedIcon />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Процессы</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <ToolbarActionsWithSearch
            buttons={buttons}
            searchTitle={'Найти сообщение'}
            //valueRef={valueRef}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
            value={(pageParamLocal?.filterText as undefined) || ''}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <DeviceLogsListTable messages={messageList} />
            </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceLogsList;
