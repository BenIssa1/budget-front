import axiosAuth from "@/lib/axios";
import { CreateServiceData, EditServiceData, ServiceAPI, ServiceListResponse } from "@/types/service";

export const getServices = async (
): Promise<{
    services: ServiceAPI[];
}> => {
    const response = await axiosAuth.get(`/services`);
    const data: ServiceListResponse = response;

    return {
        services: data.data,
    };
};

export const createService = async (
    data: CreateServiceData
): Promise<ServiceAPI> => {
    const response = await axiosAuth.post("/services", data);
    return response.data;
};

export const editService = async (id: string, data: Omit<EditServiceData, "id">): Promise<ServiceAPI> => {
    const response = await axiosAuth.put(`/services/${id}`, data);
    return response.data;
};

export async function deleteService(id: string) {
    const response = await axiosAuth.delete(`/services/${id}`);
    return response.data;
}