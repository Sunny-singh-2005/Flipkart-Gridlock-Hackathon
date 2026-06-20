export interface JunctionInfo {
  rank: number;
  junction: string;
  violations: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  topVehicle: string;
  topViolation: string;
  approvalRate: number;
  latitude: number;
  longitude: number;
  peakHour: number;
  peakViolations: number;
  peakType: "Genuine peak" | "Likely batch upload" | "Daytime activity";
}

export interface StationStats {
  station: string;
  totalViolations: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  approvalRate: number;
  isGap: boolean;
  quadrant: 1 | 2 | 3 | 4; // 1 = Deploy Now, 2 = Sustain & Scale, 3 = Monitor, 4 = Best Practice
}

export interface MonthlyTrend {
  monthName: string;
  violations: number;
}

export interface DayOfWeekPattern {
  day: string;
  violations: number;
}

export interface VehicleRisk {
  type: string;
  percentage: number;
  count: number;
  color: string;
  riskNote: string;
}

export interface RecommendationRow {
  priority: number;
  station: string;
  action: string;
  suggestedPatrolWindow: string;
  kpiEstimate: string;
}
