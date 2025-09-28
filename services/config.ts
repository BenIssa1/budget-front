import axiosAuth from "@/lib/axios";
import { CreateConfigData, EditConfigData, ConfigAPI, ConfigListResponse } from "@/types/config";

export const getConfigs = async (
): Promise<{
    configs: ConfigAPI[];
}> => {
    const response = await axiosAuth.get(`/configurations`);
    const data: ConfigListResponse = response;

    return {
        configs: data.data,
    };
};

export const createConfig = async (
    data: CreateConfigData
): Promise<ConfigAPI> => {
    const response = await axiosAuth.post("/configurations", data);
    return response.data;
};

export const editConfig = async (id: string, data: Omit<EditConfigData, "id">): Promise<ConfigAPI> => {
    const response = await axiosAuth.put(`/configurations/${id}`, data);
    return response.data;
};

export async function deleteConfig(id: string) {
    const response = await axiosAuth.delete(`/configurations/${id}`);
    return response.data;
}
