import { IProcess } from '@lib/types';
import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@material-ui/core';

import { NavLink } from 'react-router-dom';

import { adminPath } from '../../utils/constants';

interface IProps {
  process: IProcess;
}

const ProcessDetailsView = ({ process }: IProps) => {
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
                <NavLink to={`${adminPath}/app/companies/${process.company?.id}`} key={process.company?.id}>
                  <Typography color="textPrimary" variant="h4" key={process.company?.id} gutterBottom>
                    {process.company.name}
                  </Typography>
                </NavLink>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Подсистема
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {process.appSystem.name}
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
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Дата создания
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {new Date(process.dateBegin || '').toLocaleString('ru', { hour12: false })}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Дата окончания
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="h4" gutterBottom>
                  {new Date(process.dateEnd || '').toLocaleString('ru', { hour12: false })}
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
