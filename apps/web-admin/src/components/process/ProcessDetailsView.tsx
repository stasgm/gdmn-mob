import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { ICompany, IProcess } from '@lib/types';

import { NavLink } from 'react-router-dom';

import { adminPath } from '../../utils/constants';

interface IProps {
  process: IProcess;
  company?: ICompany;
}

const ProcessDetailsView = ({ process, company }: IProps) => {
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
                  Компания
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <NavLink to={`${adminPath}/app/companies/${company?.id}`} key={company?.id}>
                  <Typography color="textPrimary" variant="h4" key={company?.id} gutterBottom>
                    {company?.name}
                  </Typography>
                </NavLink>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Система
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {process.appSystem}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Статус
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {process.status}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProcessDetailsView;
