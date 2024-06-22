/* eslint-disable react/prop-types */

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ComboChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        width={730}
        height={250}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Bar dataKey="max" barSize={20} fill="#D22B2B" />
        <Bar dataKey="min" barSize={20} fill="#097969" />
        <Line type="monotone" dataKey="average" stroke="#ff7300" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ComboChartComponent;
