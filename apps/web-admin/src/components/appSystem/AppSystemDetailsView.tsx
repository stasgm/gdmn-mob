import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { IAppSystem, ICompany, IProcess } from '@lib/types';

import { NavLink } from 'react-router-dom';

import { adminPath } from '../../utils/constants';

interface IProps {
  appSystem: IAppSystem;
}

const AppSystemDetailsView = ({ appSystem }: IProps) => {
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
                  Подсистема
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {appSystem.name}
                </Typography>
              </Grid>
              {appSystem.description ? (
                <>
                  <Grid item md={2} xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Описание
                    </Typography>
                  </Grid>
                  <Grid item md={10} xs={6}>
                    <Typography variant="h4" gutterBottom>
                      {appSystem.description}
                    </Typography>
                  </Grid>
                </>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AppSystemDetailsView;
