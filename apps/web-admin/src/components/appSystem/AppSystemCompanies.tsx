import { Box } from '@mui/material';

import { useCallback, useEffect, useRef, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';

import { ICompany } from '@lib/types';

import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import { companyActions, companySelectors } from '../../store/company';
import CircularProgressWithContent from '../CircularProgressWidthContent';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import SortableTable from '../SortableTable';

const headCells: IHeadCells<ICompany>[] = [
  { id: 'name', label: 'Наименование', sortEnable: true },
  { id: 'id', label: 'Идентификатор', sortEnable: true },
  { id: 'admin', label: 'Администратор', sortEnable: true },
  { id: 'creationDate', label: 'Дата создания', sortEnable: true },
  { id: 'editionDate', label: 'Дата редактирования', sortEnable: true },
];

interface IProps {
  appSystemId: string;
}

const AppSystemCompanies = ({ appSystemId }: IProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, pageParams } = useSelector((state) => state.companies);
  const list = companySelectors.companyByAppSystemId(appSystemId);

  const [filterText, setFilterText] = useState(pageParams?.filterText || '');
  const prevFilterTextRef = useRef<string | undefined | null>(null);

  const fetchCompanies = useCallback(() => {
    dispatch(companyActions.fetchCompanies(pageParams?.filterText));
  }, [dispatch, pageParams?.filterText]);

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента или при изменении фильтра
    if (prevFilterTextRef.current !== pageParams?.filterText) {
      prevFilterTextRef.current = pageParams?.filterText;
      fetchCompanies();
    }
  }, [fetchCompanies, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    setFilterText(value);
    if (value) return;
    dispatch(companyActions.setPageParam({ filterText: '', page: 0 }));
  };

  const handleSearchClick = () => {
    dispatch(companyActions.setPageParam({ filterText, page: 0 }));
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(companyActions.setPageParam({ filterText: '', page: 0 }));
    setFilterText('');
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        companyActions.setPageParam({
          page: pageParams.page,
          limit: pageParams.limit,
        }),
      );
    },
    [dispatch],
  );

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { mx: 1 },
      onClick: fetchCompanies,
      icon: <CachedIcon />,
    },
  ];

  return (
    <>
      <ToolbarActionsWithSearch
        buttons={buttons}
        searchTitle={'Найти компанию'}
        updateInput={handleUpdateInput}
        searchOnClick={handleSearchClick}
        keyPress={handleKeyPress}
        value={filterText}
        clearOnClick={handleClearSearch}
        disabled={loading}
      />
      {loading ? (
        <CircularProgressWithContent content={'Идет загрузка данных...'} />
      ) : (
        <Box sx={{ pt: 2 }}>
          <SortableTable<ICompany>
            headCells={headCells}
            data={list}
            path={'/app/companies/'}
            onSetPageParams={handleSetPageParams}
            pageParams={pageParams}
            byMaxHeight={true}
            minusHeight={112}
          />
        </Box>
      )}
    </>
  );
};

export default AppSystemCompanies;
