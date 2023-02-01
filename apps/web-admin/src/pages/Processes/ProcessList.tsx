import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import CachedIcon from '@material-ui/icons/Cached';

import ToolbarActionsWithSearch from '../../components/ToolbarActionsWithSearch';
import { useSelector, useDispatch } from '../../store';
import actions from '../../store/process';
import companyActions from '../../store/company';
import { IPageParam, IToolBarButton } from '../../types';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import ProcessListTable from '../../components/process/ProcessListTable';

const ProcessList = () => {
  const dispatch = useDispatch();
  const { list: processes, loading, pageParams } = useSelector((state) => state.processes);
  const companies = useSelector((state) => state.companies.list);

  const fetchProcesses = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(actions.fetchProcesses(filterText, fromRecord, toRecord));
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

  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;
  };

  const handleSearchClick = () => {
    dispatch(actions.setPageParam({ filterText: pageParamLocal?.filterText }));
    fetchProcesses(pageParamLocal?.filterText as string);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;
    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(actions.setPageParam({ filterText: undefined }));
    setPageParamLocal({ filterText: undefined });
    fetchProcesses();
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
            searchTitle={'Найти процесс'}
            updateInput={handleUpdateInput}
            searchOnClick={handleSearchClick}
            keyPress={handleKeyPress}
            value={(pageParamLocal?.filterText as undefined) || ''}
            clearOnClick={handleClearSearch}
          />
          {loading ? (
            <CircularProgressWithContent content={'Идет загрузка данных...'} />
          ) : (
            <Box sx={{ pt: 2 }}>
              <ProcessListTable processes={processes} companies={companies} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ProcessList;
