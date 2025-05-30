// src/components/StatsCards.tsx

import React from 'react';

interface StatsCardsProps {
  uniqueIPs: number;
  anomalies: Record<string, number>;
}

const StatsCards: React.FC<StatsCardsProps> = ({ uniqueIPs, anomalies }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-sm text-gray-500">Уникальных IP</h2>
        <p className="text-2xl font-semibold">{uniqueIPs}</p>
      </div>
      {Object.entries(anomalies).map(([type, count]) => (
        <div key={type} className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500">{type}</h2>
          <p className="text-2xl font-semibold">{count}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
