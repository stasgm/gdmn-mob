import { CardHeader, CardContent, Typography, Card, Grid2 as Grid, Divider } from '@mui/material';

import { IAppSystem } from '@lib/types';

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
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Наименование
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {appSystem.name}
                </Typography>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Версия
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {appSystem.appVersion}
                </Typography>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Описание
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {appSystem.description}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AppSystemDetailsView;
