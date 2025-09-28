export interface PricingPaidAPI {
    id: string;
    ordernumber: string
    prefix: string
    amount: string
    description: string
}

export interface PricingPaidListResponse {
    data: PricingPaidAPI[];
}

export interface CreatePricingPaidData {
    id?: string;
    ordernumber: string
    prefix: string
    amount: string
    description: string
}

export interface EditPricingPaidData {
    id: string;
    ordernumber: string
    prefix: string
    amount: string
    description: string
}