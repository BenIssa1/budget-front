import axiosAuth from "@/lib/axios";
import { Statistics } from "@/types/statistics";

export const getGeneralStatistics = async (): Promise<Statistics> => {
  const response = await axiosAuth.get("/statistics/general");
  return response.data;
};
