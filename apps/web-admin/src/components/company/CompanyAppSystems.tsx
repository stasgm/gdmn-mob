import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IAppSystemCompany, ICompanyWithAppSystems } from '@lib/types';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useNavigate } from 'react-router';

import SortableTable from '../SortableTable';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useDispatch, useSelector } from '../../store';
import CircularProgressWithContent from '../CircularProgressWidthContent';
import { appSystemActions, appSystemSelectors } from '../../store/appSystem';
import { companySelectors } from '../../store/company';

const headCells: IHeadCells<IAppSystemCompany>[] = [
  { id: 'id', label: 'Идентификатор', sortEnable: true },
  { id: 'name', label: 'Подсистема', sortEnable: true },
  { id: 'deviceCount', label: 'Количество устройств', sortEnable: true },
  { id: 'description', label: 'Описание', sortEnable: true },
];

interface IProps {
  companyId: string;
}

const CompanyAppSystems = ({ companyId }: IProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const company = companySelectors.companyById(companyId);
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

  const handleAddAppSystem = () => {
    // if (list.length && !(authUser?.role === 'SuperAdmin')) {
    //   dispatch(companyActions.setError('Компания уже существует'));
    // } else {
    return navigate(`${location.pathname}/new`);
    // }
  };

  const handleUpdateAppSystem = () => {
    // if (list.length && !(authUser?.role === 'SuperAdmin')) {
    //   dispatch(companyActions.setError('Компания уже существует'));
    // } else {
    //   return navigate(`${location.pathname}/new`);
    // }
    return navigate(`${location.pathname}/new`);
  };

  const handleDeleteAppSystem = () => {
    // if (list.length && !(authUser?.role === 'SuperAdmin')) {
    //   dispatch(companyActions.setError('Компания уже существует'));
    // } else {
    //   return navigate(`${location.pathname}/new`);
    // }
    return navigate(`${location.pathname}/new`);
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
      {
        name: 'Добавить',
        color: 'primary',
        variant: 'contained',
        onClick: handleAddAppSystem,
        icon: <AddCircleOutlineIcon />,
      },
      // {
      //   name: 'Редактировать',
      //   color: 'primary',
      //   variant: 'contained',
      //   onClick: handleUpdateAppSystem,
      //   icon: <EditIcon />,
      // },
      // {
      //   name: 'Удалить',
      //   color: 'primary',
      //   variant: 'contained',
      //   onClick: handleDeleteAppSystem,
      //   icon: <DeleteIcon />,
      // },
    ],
    [fetchAppSystems, handleAddAppSystem, loading],
  );
  if (!company) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Компания не найдена
      </Box>
    );
  }

  console.log('company: ', company.toString());

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
          <SortableTable<ICompanyWithAppSystems>
            headCells={headCells}
            data={company.appSystems || []}
            path={`/app/companies/${companyId}/appSystems/`}
            // endPath={'erpLog'}
            onSetPageParams={handleSetPageParams}
            pageParams={pageParams}
            byMaxHeight={true}
            minusHeight={112}
          />
          {/* <SortableTable<IAppSystem>
            headCells={headCells}
            data={appSystems}
            path={`/app/companies/${companyId}/appSystems/`}
            endPath={'erpLog'}
            onSetPageParams={handleSetPageParams}
            pageParams={pageParams}
            byMaxHeight={true}
            minusHeight={112}
          /> */}
        </Box>
      )}
    </Box>
  );
};

export default CompanyAppSystems;
