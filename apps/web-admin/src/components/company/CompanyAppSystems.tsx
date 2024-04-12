import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IAppSystem } from '@lib/types';
import CachedIcon from '@mui/icons-material/Cached';

import SortableTable from '../SortableTable';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import CircularProgressWithContent from '../CircularProgressWidthContent';
import { appSystemActions, appSystemSelectors } from '../../store/appSystem';

const headCells: IHeadCells<IAppSystem>[] = [
  { id: 'name', label: 'Подсистема', sortEnable: true },
  { id: 'id', label: 'Идентификатор', sortEnable: true },
  { id: 'description', label: 'Описание', sortEnable: true },
];

interface IProps {
  companyId: string;
}

const CompanyAppSystems = ({ companyId }: IProps) => {
  const dispatch = useDispatch();
  const appSystems = appSystemSelectors.appSystemsByCompanyId(companyId);
  const { loading, pageParams } = useSelector((state) => state.appSystems);
  const [filterText, setFilterText] = useState(pageParams?.filterText || '');
  const prevFilterTextRef = useRef<string | undefined | null>(null);

  useEffect(() => {
    if (!pageParams) {
      setFilterText('');
    }
  }, [pageParams]);

  const fetchAppSystems = useCallback(() => {
    dispatch(appSystemActions.fetchAppSystems(companyId, pageParams?.filterText));
  }, [companyId, dispatch, pageParams?.filterText]);

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента или при изменении фильтра
    if (prevFilterTextRef.current !== pageParams?.filterText) {
      prevFilterTextRef.current = pageParams?.filterText;
      fetchAppSystems();
    }
  }, [fetchAppSystems, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    setFilterText(value);
    if (value) return;
    dispatch(appSystemActions.setPageParam({ filterText: '', page: 0 }));
  };

  const handleSearchClick = () => {
    dispatch(appSystemActions.setPageParam({ filterText, page: 0 }));
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;
    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(appSystemActions.setPageParam({ filterText: '', page: 0 }));
    setFilterText('');
  };

  const handleSetPageParams = useCallback(
    (newParams: IPageParam) => {
      dispatch(
        appSystemActions.setPageParam({
          page: newParams.page,
          limit: newParams.limit,
        }),
      );
    },
    [dispatch],
  );

  const userButtons: IToolBarButton[] = useMemo(
    () => [
      {
        name: 'Обновить',
        sx: { mx: 1 },
        onClick: fetchAppSystems,
        icon: <CachedIcon />,
        disablde: loading,
      },
    ],
    [fetchAppSystems, loading],
  );

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <ToolbarActionsWithSearch
        buttons={userButtons}
        searchTitle={'Найти подсистему'}
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
          <SortableTable<IAppSystem>
            headCells={headCells}
            data={appSystems}
            path={`/app/companies/${companyId}/appSystems/`}
            endPath={'erpLog'}
            onSetPageParams={handleSetPageParams}
            pageParams={pageParams}
            byMaxHeight={true}
            minusHeight={112}
          />
        </Box>
      )}
    </Box>
  );
};

export default CompanyAppSystems;
