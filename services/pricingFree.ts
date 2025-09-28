import axiosAuth from "@/lib/axios";
import { CreatePricingFreeData, EditPricingFreeData, PricingFreeAPI, PricingFreeListResponse } from "@/types/pricingFree";

export const getPricingFrees = async (
): Promise<{
    pricingFrees: PricingFreeAPI[];
}> => {
    const response = await axiosAuth.get(`/pricing-frees`);
    const data: PricingFreeListResponse = response;

    return {
        pricingFrees: data.data,
    };
};

export const createPricingFree = async (
    data: CreatePricingFreeData
): Promise<PricingFreeAPI> => {
    const response = await axiosAuth.post("/pricing-frees", data);
    return response.data;
};

export const editPricingFree = async (id: string, data: Omit<EditPricingFreeData, "id">): Promise<PricingFreeAPI> => {
    const response = await axiosAuth.put(`/pricing-frees/${id}`, data);
    return response.data;
};

export async function deletePricingFree(id: string) {
    const response = await axiosAuth.delete(`/pricing-frees/${id}`);
    return response.data;
}