import { Card, CardContent, Typography } from '@mui/material';

import { IAppSystemCompany } from '@lib/types';
import Grid from '@mui/system/Grid';

interface IProps {
  appSystem: IAppSystemCompany;
  companyName: string;
}

const CompanyAppSystemDetailsView = ({ appSystem, companyName }: IProps) => {
  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid size={{ md: 2, xs: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Компания
            </Typography>
          </Grid>
          <Grid size={{ md: 10, xs: 6 }}>
            <Typography variant="h6" gutterBottom>
              {companyName}
            </Typography>
          </Grid>
          <Grid size={{ md: 2, xs: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Подсистема
            </Typography>
          </Grid>
          <Grid size={{ md: 10, xs: 6 }}>
            <Typography variant="h6">{appSystem.name}</Typography>
          </Grid>
          <Grid size={{ md: 2, xs: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Количество
            </Typography>
          </Grid>
          <Grid size={{ md: 10, xs: 6 }}>
            <Typography variant="h6">{appSystem.deviceCount}</Typography>
          </Grid>
          <Grid size={{ md: 2, xs: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Версия
            </Typography>
          </Grid>
          <Grid size={{ md: 10, xs: 6 }}>
            <Typography variant="h6">{appSystem.appVersion}</Typography>
          </Grid>
          <Grid size={{ md: 2, xs: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Описание
            </Typography>
          </Grid>
          <Grid size={{ md: 10, xs: 6 }}>
            <Typography variant="h6">{appSystem.description}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyAppSystemDetailsView;
