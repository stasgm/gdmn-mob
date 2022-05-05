import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { IUser, NewUser } from '@lib/types';

import { idText } from 'typescript';

import { useCallback, useEffect } from 'react';

import UserDetails from '../../components/user/UserDetails';
import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/user';

import appSystemsActions from '../../store/appSystem';
import companyActions from '../../store/company';

const UserCreate = () => {
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.users);

  const { list: companies, loading: loadingCompany } = useSelector((state) => state.companies);
  const { list } = useSelector((state) => state.appSystems);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    dispatch(companyActions.fetchCompanies());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('comp', companies);

  const company = companies.find((i) => i);

  console.log('company', company);

  // const appSystems = list.map((i) => {
  //   if (company?.appSystems?.find((item) => item === i.id)) {
  //     return { id: i.id, name: i.name };
  //   } else {
  //     return;
  //   }
  // });

  // const appSystems: [] = [];

  // // for (const item of company?.appSystems) {
  // //   if (list.find((i) => i.id === item)) {
  // //     appSystems.push({ id: i.id, name: i.name });
  // //   }
  // // }

  // for (const item of list) {
  //   if (company?.appSystems?.find((i) => i === item.id)) {
  //     // appSystems.push(item.name);
  //     appSystems.push({ id: item.id, name: item.name });
  //   }
  // }

  // console.log('apps', appSystems);

  const goBack = () => {
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(actions.userActions.clearError());
  };

  const handleSubmit = async (values: IUser | NewUser) => {
    console.log(values);
    const res = await dispatch(actions.addUser(values as NewUser));
    if (res.type === 'USER/ADD_SUCCESS') {
      goBack();
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'inline-flex', marginBottom: 1 }}>
            <CardHeader title={'Добавление пользователя'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        <UserDetails
          user={{} as NewUser}
          loading={loading && loadingCompany}
          onSubmit={handleSubmit}
          onCancel={goBack}
          // appSystems={appSystems}
        />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default UserCreate;
