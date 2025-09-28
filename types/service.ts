export interface ServiceAPI {
    id: string;
    label: string
    description: string
}

export interface ServiceListResponse {
    data: ServiceAPI[];
}

export interface CreateServiceData {
    id?: string;
    label: string
    description: string
}

export interface EditServiceData {
    id: string;
    label: string
    description: string
}