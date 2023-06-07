import { CardHeader, CardContent, Typography, Card, Grid, Divider } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { ILinkedEntity } from '../types';

interface IProps {
  details: ILinkedEntity[];
}

const DetailsView = ({ details }: IProps) => {
  const getFieldValue = (value: any) => {
    if (typeof value === 'number' || !isNaN(value)) {
      return value.toString();
    }

    if (!isNaN(new Date(value).getDate())) {
      return new Date(value || '').toLocaleString('ru', { hour12: false });
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'object' && 'name' in value) {
      return value.name;
    }

    return value;
  };

  return (
    <Card>
      <CardHeader title="Общая информация" />
      <Divider />
      <CardContent>
        <Grid>
          <Grid>
            {details.map((item, index) => (
              <Grid container key={index}>
                <Grid item md={2} xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.id}
                  </Typography>
                </Grid>
                <Grid item md={10} xs={6}>
                  {Array.isArray(item.value) ? (
                    item.value.map((i) => (
                      <Typography variant="h4" gutterBottom key={item.id}>
                        {getFieldValue(i)}
                      </Typography>
                    ))
                  ) : item.link ? (
                    <NavLink to={item.link}>
                      <Typography variant="h4" color="textPrimary" gutterBottom>
                        {getFieldValue(item.value)}
                      </Typography>
                    </NavLink>
                  ) : (
                    <Typography variant="h4" gutterBottom>
                      {getFieldValue(item.value)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DetailsView;
