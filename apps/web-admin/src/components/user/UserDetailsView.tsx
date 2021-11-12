import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { IUser } from '@lib/types';

import { NavLink } from 'react-router-dom';

import { adminPath } from '../../utils/constants';

interface IProps {
  user: IUser;
}

const UserDetailsView = ({ user }: IProps) => {
  return (
    <Card>
      <CardHeader title="Общая информация" />
      <Divider />
      <CardContent>
        <Grid>
          <Grid>
            <Grid container>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Пользователь
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {user.name}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Имя
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {user.firstName}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Фамилия
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {user.lastName}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Телефон
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {user.phoneNumber}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Email
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {user.email}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Пользователь ERP
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {user.alias}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Компания
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <NavLink to={`${adminPath}/app/companies/${user.company?.id}`} key={user.company?.id}>
                  <Typography color="textPrimary" variant="h4" key={user.company?.id} gutterBottom>
                    {user.company?.name}
                  </Typography>
                </NavLink>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserDetailsView;
