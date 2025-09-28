export interface PricingFreeAPI {
    id: string;
    contact: string
    description: string
}

export interface PricingFreeListResponse {
    data: PricingFreeAPI[];
}

export interface CreatePricingFreeData {
    id?: string;
    contact: string
    description: string
}

export interface EditPricingFreeData {
    id: string;
    contact: string
    description: string
}