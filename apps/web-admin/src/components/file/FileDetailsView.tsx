import { ISystemFile } from '@lib/types';
import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { adminPath } from '../../utils/constants';

interface IProps {
  list: ISystemFile;
}
const FileDetailsView = ({ list }: IProps) => {
  return (
    <Card>
      <CardHeader title="Общая информация" />
      <Divider />
      <CardContent>
        <Grid>
          <Grid container>
            <Grid item md={2} xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                Название
              </Typography>
            </Grid>
            <Grid item md={10} xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                {list.id}
              </Typography>
            </Grid>
            <Grid item md={2} xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                Путь
              </Typography>
            </Grid>
            <Grid item md={10} xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                {list.path}
              </Typography>
            </Grid>
            {list.company ? (
              <>
                <Grid item md={2} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Компания
                  </Typography>
                </Grid>
                <Grid item md={10} xs={6}>
                  <NavLink to={`${adminPath}/app/companies/${list.company?.id}`} key={list.company?.id}>
                    <Typography color="textPrimary" variant="subtitle1" key={list.company?.id} gutterBottom>
                      {list.company?.name || ''}
                    </Typography>
                  </NavLink>
                </Grid>
              </>
            ) : null}
            {list.appSystem ? (
              <>
                <Grid item md={2} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Подсистема
                  </Typography>
                </Grid>
                <Grid item md={10} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    {list.appSystem?.name}
                  </Typography>
                </Grid>
              </>
            ) : null}
            {list.device ? (
              <>
                <Grid item md={2} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Устройство
                  </Typography>
                </Grid>
                <Grid item md={10} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    {list.device?.name}
                  </Typography>
                </Grid>
                <Grid item md={2} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Номер
                  </Typography>
                </Grid>
                <Grid item md={10} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    {list.device?.id}
                  </Typography>
                </Grid>
              </>
            ) : null}
            {list.producer ? (
              <>
                <Grid item md={2} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    {list.consumer ? 'Отправитель' : 'Пользователь'}
                  </Typography>
                </Grid>
                <Grid item md={10} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    {list.producer?.name}
                  </Typography>
                </Grid>
              </>
            ) : null}
            {list.consumer ? (
              <>
                <Grid item md={2} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Получатель
                  </Typography>
                </Grid>
                <Grid item md={10} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    {list.consumer.name}
                  </Typography>
                </Grid>
              </>
            ) : null}
            <Grid item md={2} xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                Дата
              </Typography>
            </Grid>
            <Grid item md={10} xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                {new Date(list.date || '').toLocaleString('ru', { hour12: false })}
              </Typography>
            </Grid>
            <Grid item md={2} xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                Размер
              </Typography>
            </Grid>
            <Grid item md={10} xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                {Math.ceil(list.size).toString()} кб
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FileDetailsView;
