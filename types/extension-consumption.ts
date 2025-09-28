export interface ExtensionConsumption {
  extensionId: number;
  extensionNumber: string;
  name: string;
  calls: number;
  durationSeconds: number;
  durationMinutes: number;
  cost: number;
  balance: number;
}

export interface Period {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
}

export interface ConsumptionSummary {
  totalExtensions: number;
  totalCalls: number;
  totalDuration: number;
  totalCost: number;
  averageCostPerExtension: number;
}

export interface MonthlyConsumptionResponse {
  period: Period;
  data: ExtensionConsumption[];
  topConsumption: ExtensionConsumption[];
  summary: ConsumptionSummary;
}
