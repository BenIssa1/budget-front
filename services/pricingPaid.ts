import axiosAuth from "@/lib/axios";
import { CreatePricingPaidData, EditPricingPaidData, PricingPaidAPI, PricingPaidListResponse } from "@/types/pricingPaid";

export const getPricingPaids = async (
): Promise<{
    pricingPaids: PricingPaidAPI[];
}> => {
    const response = await axiosAuth.get(`/pricing-paids`);
    const data: PricingPaidListResponse = response;

    return {
        pricingPaids: data.data,
    };
};

export const createPricingPaid = async (
    data: CreatePricingPaidData
): Promise<PricingPaidAPI> => {
    const transformed = {
        ...data,
        amount: Number(data.amount),
    };
    const response = await axiosAuth.post("/pricing-paids", transformed);
    return response.data;
};

export const editPricingPaid = async (id: string, data: Omit<EditPricingPaidData, "id">): Promise<PricingPaidAPI> => {
    const transformed = {
        ...data,
        amount: Number(data.amount),
    };
    const response = await axiosAuth.put(`/pricing-paids/${id}`, transformed);
    return response.data;
};

export async function deletePricingPaid(id: string) {
    const response = await axiosAuth.delete(`/pricing-paids/${id}`);
    return response.data;
}