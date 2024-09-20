import { Box } from '@mui/material';

import { useCallback, useEffect, useRef, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';

import { IUser } from '@lib/types';

import ToolbarActionsWithSearch from '../ToolbarActionsWithSearch';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import { IHeadCells, IToolBarButton, IPageParam } from '../../types';
import SortableTable from '../SortableTable';
import { userActions, userSelectors } from '../../store/user';
import { bindingActions } from '../../store/deviceBinding';
import CircularProgressWithContent from '../CircularProgressWidthContent';

const headCells: IHeadCells<IUser>[] = [
  { id: 'id', label: 'Идентификатор', sortEnable: true },
  { id: 'name', label: 'Пользователь', sortEnable: true },
  { id: 'lastName', label: 'Фамилия', sortEnable: true },
  { id: 'firstName', label: 'Имя', sortEnable: true },
  { id: 'phoneNumber', label: 'Телефон', sortEnable: false },
  { id: 'creationDate', label: 'Дата создания', sortEnable: false },
  { id: 'editionDate', label: 'Дата редактирования', sortEnable: false },
];

interface IProps {
  companyId?: string;
  deviceId: string;
}

const DeviceUsers = ({ companyId, deviceId }: IProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { loading: userLoading, pageParams } = useSelector((state) => state.users);
  const bindingLoadings = useSelector((state) => state.deviceBindings.loading);
  const users = userSelectors.usersByDeviceId(deviceId);

  const [filterText, setFilterText] = useState(pageParams?.filterText || '');
  const prevFilterTextRef = useRef<string | undefined | null>(null);

  const fetchData = useCallback(() => {
    dispatch(userActions.fetchUsers(companyId, pageParams?.filterText));
    dispatch(bindingActions.fetchDeviceBindings());
  }, [companyId, dispatch, pageParams?.filterText]);

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента или при изменении фильтра
    if (prevFilterTextRef.current !== pageParams?.filterText) {
      prevFilterTextRef.current = pageParams?.filterText;
      fetchData();
    }
  }, [fetchData, pageParams?.filterText]);

  const handleUpdateInput = (value: string) => {
    setFilterText(value);
    if (value) return;
    dispatch(userActions.setPageParam({ filterText: '', page: 0 }));
  };

  const handleSearchClick = () => {
    dispatch(userActions.setPageParam({ filterText, page: 0 }));
  };

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter') return;

    handleSearchClick();
  };

  const handleClearSearch = () => {
    dispatch(userActions.setPageParam({ filterText: '', page: 0 }));
    setFilterText('');
  };

  const handleSetPageParams = useCallback(
    (pageParams: IPageParam) => {
      dispatch(
        userActions.setPageParam({
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
      onClick: fetchData,
      icon: <CachedIcon />,
    },
  ];

  return (
    <>
      <ToolbarActionsWithSearch
        buttons={buttons}
        searchTitle={'Найти пользователя'}
        updateInput={handleUpdateInput}
        searchOnClick={handleSearchClick}
        keyPress={handleKeyPress}
        value={filterText}
        clearOnClick={handleClearSearch}
        disabled={userLoading || bindingLoadings}
      />
      {userLoading || bindingLoadings ? (
        <CircularProgressWithContent content={'Идет загрузка данных...'} />
      ) : (
        <Box sx={{ pt: 2 }}>
          <SortableTable<IUser>
            headCells={headCells}
            data={users}
            path={'/app/users/'}
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

export default DeviceUsers;
