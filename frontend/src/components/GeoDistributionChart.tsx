// src/components/GeoDistributionChart.tsx

import React from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { GeoDistribution } from '../types/dashboard';

interface GeoDistributionChartProps {
  geo: GeoDistribution[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

const GeoDistributionChart: React.FC<GeoDistributionChartProps> = ({ geo }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">🌍 Геораспределение IP</h2>
      <PieChart width={300} height={250}>
        <Pie
          data={geo}
          dataKey="count"
          nameKey="country"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {geo.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default GeoDistributionChart;
