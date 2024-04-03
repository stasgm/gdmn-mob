import { IProcess } from '@lib/types';
import { CardContent, Typography, Card, Grid } from '@mui/material';

import { NavLink } from 'react-router-dom';

import { adminPath } from '../../utils/constants';

interface IProps {
  process: IProcess;
}

const ProcessDetailsView = ({ process }: IProps) => {
  return (
    <Card>
      <CardContent>
        <Grid>
          <Grid>
            <Grid container>
              <Grid item md={2} xs={6}>
                <Typography variant="overline" gutterBottom>
                  Компания
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <NavLink to={`${adminPath}/app/companies/${process.company?.id}`} key={process.company?.id}>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    style={{ textDecoration: 'underline' }}
                    key={process.company?.id}
                    gutterBottom
                  >
                    {process.company.name}
                  </Typography>
                </NavLink>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="overline" gutterBottom>
                  Подсистема
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="body2" gutterBottom>
                  {process.appSystem.name}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="overline" gutterBottom>
                  Статус
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="body2" gutterBottom>
                  {process.status}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="overline" gutterBottom>
                  Дата создания
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="body2" gutterBottom>
                  {new Date(process.dateBegin || '').toLocaleString('ru', { hour12: false })}
                </Typography>
              </Grid>
              <Grid item md={2} xs={6}>
                <Typography variant="overline" gutterBottom>
                  Дата окончания
                </Typography>
              </Grid>
              <Grid item md={10} xs={6}>
                <Typography variant="body2" gutterBottom>
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
