import axiosAuth from "@/lib/axios";
import { MonthlyConsumptionResponse } from "@/types/extension-consumption";

export const getMonthlyConsumptionByExtension = async (
  year?: number,
  month?: number
): Promise<MonthlyConsumptionResponse> => {
  const params = new URLSearchParams();
  if (year) params.append('year', year.toString());
  if (month) params.append('month', month.toString());
  
  const response = await axiosAuth.get(`/statistics/monthly-consumption-by-extension?${params.toString()}`);
  return response.data;
};

export const exportMonthlyConsumptionCSV = async (
  year?: number,
  month?: number
): Promise<Blob> => {
  const params = new URLSearchParams();
  if (year) params.append('year', year.toString());
  if (month) params.append('month', month.toString());
  
  const response = await axiosAuth.get(`/statistics/monthly-consumption-csv?${params.toString()}`, {
    responseType: 'blob',
  });
  return response.data;
};
