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
import { IMessageHead, IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SnackBar from '../../components/SnackBar';
import ProcessListTable from '../../components/process/ProcessListTable';
import MessageListTable from '../../components/message/MessageListTable';

const MessageList = () => {
  const dispatch = useDispatch();

  const { list: processes, loading, errorMessage, pageParams } = useSelector((state) => state.processes);
  const companies = useSelector((state) => state.companies.list);

  const messageList: IMessageHead[] = [
    {
      appSystem: {
        id: '5c66190ef4',
        name: 'gdmn-sales-representative',
      },
      company: { id: 'a60dfec9cf', name: 'Company' },
      consumer: {
        id: '407436c548',
        name: 'User',
      },
      producer: { id: 'd5cf297beb', name: 'gdmn' },
      createdDate: new Date(),
      device: { id: 'b8a193619c', name: 'Android' },
      id: generateId(),
      message: 'r6c391349b_from_d5cf297beb_to_407436c548_dev_b8a193619c.json',
    },
    {
      appSystem: {
        id: '5c66190ef4',
        name: 'gdmn-sales-representative',
      },
      company: { id: 'a60dfec9cf', name: 'Company' },
      consumer: {
        id: '495079182b',
        name: 'User1',
      },
      producer: { id: 'd5cf297beb', name: 'gdmn' },
      createdDate: new Date(),
      device: { id: 'f39a2e5af4', name: 'Xiaomi' },
      id: generateId(),
      message: '78dj2q940a_from_d5cf297beb_to_495079182b_dev_f39a2e5af4.json',
    },
    {
      appSystem: {
        id: '5c66190ef4',
        name: 'gdmn-sales-representative',
      },
      company: { id: 'a60dfec9cf', name: 'Company' },
      consumer: {
        id: 'e3dfc0ae8f',
        name: 'User2',
      },
      producer: { id: 'd5cf297beb', name: 'gdmn' },
      createdDate: new Date(),
      device: { id: '7a403b958a', name: 'iphone' },
      id: generateId(),
      message: 'd6c330949b_from_d5cf297beb_to_e3dfc0ae8f_dev_7a403b958a.json',
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
              <MessageListTable messages={messageList} />
            </Box>
          )}
        </Container>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default MessageList;
