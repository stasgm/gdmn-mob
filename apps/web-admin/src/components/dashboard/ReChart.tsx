import { ICompany, IUser } from '@lib/types';
import React from 'react';
import { Box, Grid, Card } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface IProps {
  company: ICompany | undefined;
  data: any[];
}
const SimpleLineChart = ({ company, data }: IProps) => {
  return company ? (
    <>
      <Grid bgcolor={'white'} ml={3} mt={2} right={10} mr={3}>
        <Card>
          <Box mt={2}>
            <LineChart
              width={window.innerWidth - 320}
              height={300}
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="device" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="device2" stroke="#82ca9d" />
              <Line type="monotone" dataKey="device3" stroke="#42ca9d" />
            </LineChart>
          </Box>
        </Card>
      </Grid>
      ;
    </>
  ) : null;
};
export default SimpleLineChart;
