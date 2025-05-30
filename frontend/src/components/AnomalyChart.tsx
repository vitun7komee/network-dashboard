// src/components/AnomalyChart.tsx

import React from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AnomalyChartProps {
  anomalies: Record<string, number>;
}

const AnomalyChart: React.FC<AnomalyChartProps> = ({ anomalies }) => {
  const data = Object.entries(anomalies).map(([type, count]) => ({ type, count }));

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">🚨 Аномалии по типам</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalyChart;
