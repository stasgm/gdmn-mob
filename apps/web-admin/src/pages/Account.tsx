import { Helmet } from 'react-helmet';
import { Box, Container, Grid, CircularProgress } from '@material-ui/core';

import { IUser } from '@lib/types';

import { useSelector } from '@lib/store';

import { useCallback, useEffect, useState } from 'react';

import actions from '../store/user';

import { useDispatch, useSelector as userSelector } from '../store/';

import AccountProfile from '../components/account/AccountProfile';
import AccountProfileDetails from '../components/account/AccountProfileDetails';
import SnackBar from '../components/SnackBar';

const Account = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState<IUser | undefined>();

  const { user: account } = useSelector((state) => state.auth);

  const { errorMessage, loading } = userSelector((state) => state.users);

  const fetchUser = useCallback(
    async (id: string) => {
      if (account?.id) {
        const res = await dispatch(actions.fetchUserById(id));
        if (res.type === 'USER/FETCH_USER_SUCCCES') {
          console.log('res.payload', res.payload);
          setUser(res.payload);
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (account?.id) {
      fetchUser(account.id);
    }
  }, [fetchUser, account]);

  const handleSaveUser = async (user: IUser) => {
    const res = await dispatch(actions.updateUser(user));
    if (res.type === 'USER/UPDATE_SUCCCES') {
      fetchUser(res.payload.id);
    }
  };

  const handleClearError = () => {
    dispatch(actions.userActions.clearError());
  };

  if (!user) {
    return <Box>Пользователь не найден</Box>;
  }

  return (
    <>
      <Helmet>
        <title>Account</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        {loading && <CircularProgress size={40} />}
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} xs={12}>
              <AccountProfile user={user} />
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <AccountProfileDetails user={user} loading={loading} onSubmit={handleSaveUser} />
            </Grid>
          </Grid>
        </Container>
        <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
      </Box>
    </>
  );
};

export default Account;
