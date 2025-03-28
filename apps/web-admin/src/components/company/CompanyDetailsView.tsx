import { CardHeader, CardContent, Typography, Card, Divider } from '@mui/material';

import { ICompany } from '@lib/types';
import Grid from '@mui/system/Grid';

interface IProps {
  company: ICompany;
}

const CompanyDetailsView = ({ company }: IProps) => {
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
                  {company.name}
                </Typography>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Идентификатор
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {company.id}
                </Typography>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Город
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {company.city}
                </Typography>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Администратор
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                <Typography variant="h4" gutterBottom>
                  {company.admin.name}
                </Typography>
              </Grid>
              <Grid size={{ md: 2, xs: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Подсистемы
                </Typography>
              </Grid>
              <Grid size={{ md: 10, xs: 6 }}>
                {company.appSystems?.map((item) => (
                  <Typography variant="h4" gutterBottom key={item.id}>
                    {item.name}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailsView;
