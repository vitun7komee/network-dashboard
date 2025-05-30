// src/types/dashboard.ts

export interface Anomaly {
    type: string;
    count: number;
  }
  
  export interface GeoDistribution {
    country: string;
    count: number;
  }
  
  export interface Incident {
    date: string;
    count: number;
  }
  
  export interface DashboardData {
    uniqueIPs: number;
    anomalies: Record<string, number>;
    geoDistribution: GeoDistribution[];
    asnDistribution: any[]; // Пока заглушка
    incidents: {
      daily: Incident[];
      weekly: Incident[];
    };
  }
  