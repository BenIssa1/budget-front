import axiosAuth from "@/lib/axios";
import { BudgetAPI, BudgetListResponse, CreateBugetData, EditBudgetData } from "@/types/budget";

export const getBudgets = async (
): Promise<{
    budgets: BudgetAPI[];
}> => {
    const response = await axiosAuth.get(`/budgets`);
    const data: BudgetListResponse = response;

    return {
        budgets: data.data,
    };
};

export const createBudget = async (
    data: CreateBugetData
): Promise<BudgetAPI> => {
    const transformed = {
        ...data,
        amount: Number(data.amount),
    };
    const response = await axiosAuth.post("/budgets", transformed);
    return response.data;
};

export const editBuget = async (id: string, data: Omit<EditBudgetData, "id">): Promise<BudgetAPI> => {
    const transformed = {
        ...data,
        amount: Number(data.amount),
    };
    const response = await axiosAuth.put(`/budgets/${id}`, transformed);
    return response.data;
};

export async function deleteBudget(id: string) {
    const response = await axiosAuth.delete(`/budgets/${id}`);
    return response.data;
}