// src/components/IncidentTrends.tsx

import React from 'react';
import {
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';
import { Incident } from '../types/dashboard';

interface IncidentTrendsProps {
  daily: Incident[];
  weekly: Incident[];
}

const IncidentTrends: React.FC<IncidentTrendsProps> = ({ daily, weekly }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 mt-6">
      <h2 className="text-lg font-semibold mb-4">📆 Тренды инцидентов</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line data={daily} dataKey="count" name="День" stroke="#8884d8" />
          <Line data={weekly} dataKey="count" name="Неделя" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentTrends;
