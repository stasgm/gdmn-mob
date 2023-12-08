import { IUser } from '@lib/types';
import React from 'react';
import { Box, Grid, Card } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface IProps {
  selectedUser: IUser | undefined;
  selectedPeriod: string[] | undefined;
}
const SimpleLineChart = ({ selectedUser, selectedPeriod }: IProps) => {
  const data = [
    { name: '01.01.2023', uv: 100, pv: 900, amt: 290 },
    { name: '02.01.2023', uv: 200, pv: 680, amt: 590 },
    { name: '03.01.2023', uv: 300, pv: 500, amt: 490 },
    { name: '04.01.2023', uv: 600, pv: 880, amt: 390 },
    { name: '04.01.2023', uv: 900, pv: 980, amt: 520 },
    { name: '04.01.2023', uv: 400, pv: 600, amt: 490 },
    { name: '04.01.2023', uv: 200, pv: 980, amt: 320 },
  ];

  // const data = [
  //   { name: '01.01.2023', uv: 100 },
  //   { name: '02.01.2023', uv: 200 },
  //   { name: '03.01.2023', uv: 600 },
  //   { name: '04.01.2023', uv: 300 },
  //   { name: '04.01.2023', uv: 900 },
  //   { name: '04.01.2023', uv: 400 },
  //   { name: '04.01.2023', uv: 100 },
  // ];

  return selectedUser ? (
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
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            <Line type="monotone" dataKey="amt" stroke="#42ca9d" />
          </LineChart>
        </Box>
      </Card>
    </Grid>
  ) : null;
};
export default SimpleLineChart;
