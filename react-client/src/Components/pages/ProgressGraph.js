import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

const ProgressGraph = ({ data, goal }) => (
  <LineChart
    width={500}
    height={300}
    data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis domain={[0, Math.max(...data.map(d => d.weight), goal.target)]} />
    <Tooltip />
    <Legend />
    <ReferenceLine y={goal.target} label={`Target: ${goal.target}`} stroke="red" />
    <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
  </LineChart>
);

export default ProgressGraph;