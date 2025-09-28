import axiosAuth from "@/lib/axios";
import { ExtensionAPI, ExtensionListResponse } from "@/types/extension";

export const getExtensions = async (
): Promise<{
    extensions: ExtensionAPI[];
}> => {
    const response = await axiosAuth.get(`/extensions`);
    const data: ExtensionListResponse = response;

    return {
        extensions: data.data,
    };
};

export const addBonus = async (id: string, amount: number): Promise<void> => {
    await axiosAuth.post(`/extensions/${id}/bonus`, { amount });
};

export const syncExtensions = async (): Promise<void> => {
    await axiosAuth.get(`/yeastar/extension`);
};

export const linkBudgetToExtension = async (extensionId: string, budgetId: number): Promise<void> => {
    await axiosAuth.post(`/extensions/${extensionId}/link-budget`, { budgetId });
};

export const linkServiceToExtension = async (extensionId: string, serviceId: number): Promise<void> => {
    await axiosAuth.post(`/extensions/${extensionId}/link-service`, { serviceId });
};