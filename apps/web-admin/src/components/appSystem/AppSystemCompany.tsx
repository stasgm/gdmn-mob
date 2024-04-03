import { Box } from '@mui/material';

import { useCallback, useEffect, useState } from 'react';

import { ICompany, IAppSystem } from '@lib/types';

import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import { companyActions, companySelectors } from '../../store/company';
import CircularProgressWithContent from '../CircularProgressWidthContent';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import SortableTable from '../SortableTable';

import { useWindowResizeMaxHeight } from '../../utils/useWindowResizeMaxHeight';

const headCells: IHeadCells<ICompany>[] = [
  { id: 'name', label: 'Наименование', sortEnable: true },
  { id: 'id', label: 'Идентификатор', sortEnable: true },
  { id: 'admin', label: 'Администратор', sortEnable: true },
  { id: 'creationDate', label: 'Дата создания', sortEnable: true },
  { id: 'editionDate', label: 'Дата редактирования', sortEnable: true },
];

interface IProps {
  appSystem: IAppSystem;
}

const AppSystemCompany = ({ appSystem }: IProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, pageParams } = useSelector((state) => state.companies);
  const [pageParamLocal, setPageParamLocal] = useState<IPageParam | undefined>(pageParams);
  const list = companySelectors.companyByAppSystemID(appSystem.id);

  const maxHeight = useWindowResizeMaxHeight();

  const fetchCompanies = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(companyActions.fetchCompanies(filterText, fromRecord, toRecord));
    },
    [dispatch],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchCompanies(pageParams?.filterText);
  }, [fetchCompanies, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    const inputValue: string = value;

    setPageParamLocal({ filterText: value });

    if (inputValue) return;

    fetchCompanies('');
  };

  const handleSearchClick = () => {
    dispatch(companyActions.setPageParam({ filterText: pageParamLocal?.filterText, page: 0 }));

    fetchCompanies(pageParamLocal?.filterText);
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(companyActions.setPageParam({ filterText: undefined, page: 0 }));
    setPageParamLocal({ filterText: undefined });
    fetchCompanies();
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

  const buttons: IToolBarButton[] = [];

  return (
    <>
      <ToolbarActionsWithSearch
        buttons={buttons}
        searchTitle={'Найти компанию'}
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
          <SortableTable<ICompany>
            headCells={headCells}
            data={list}
            path={'/app/companies/'}
            onSetPageParams={handleSetPageParams}
            pageParams={pageParams}
            style={{ overflowY: 'auto', maxHeight }}
          />
        </Box>
      )}
    </>
  );
};

export default AppSystemCompany;
