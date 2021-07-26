import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { ICompany } from '@lib/types';

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
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Наименование
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {company.name}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Город
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {company.city}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Администратор
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {company.admin.name}
                </Typography>
              </Grid>
              {/* <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Дата создания
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {new Date(company.creationDate || '').toLocaleString('en-US', { hour12: false })}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Дата редактирования
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {new Date(company.editionDate || '').toLocaleString('en-US', { hour12: false })}
                </Typography>
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailsView;
