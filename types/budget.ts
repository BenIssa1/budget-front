export interface BudgetAPI {
    id: string;
    label: string
    amount: string 
    description: string
}

export interface BudgetListResponse {
    data: BudgetAPI[];
}

export interface CreateBugetData {
    id?: string;
    label: string
    amount: string 
    description: string
}

export interface EditBudgetData {
    id: string;
    label: string
    amount: string 
    description: string
}