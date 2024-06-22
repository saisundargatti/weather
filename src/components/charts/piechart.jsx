/* eslint-disable react/prop-types */
import { PieChart, Pie, Tooltip, Legend } from "recharts";

const PieChartComponent = ({ data }) => {
  console.log(data);
  return (
    <div>
      {data.map((dayData, index) => {
        const daylightHours = parseInt(dayData.value / 3600);
        const nightHours = 24 - daylightHours;

        return (
          <div key={index}>
            <h3>{dayData.name}</h3>
            <PieChart width={400} height={400}>
              <Pie
                data={[
                  { name: "Daylight", value: daylightHours },
                  { name: "Night", value: nightHours },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        );
      })}
    </div>
  );
};

export default PieChartComponent;
