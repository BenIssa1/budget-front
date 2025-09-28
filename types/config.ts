export interface ConfigAPI {
    id: string;
    ip: string;
    clientId: string;
    secretId: string;
    isActive?: boolean;
}

export interface ConfigListResponse {
    data: ConfigAPI[];
}

export interface CreateConfigData {
    id?: string;
    ip: string;
    clientId: string;
    secretId: string;
    isActive?: boolean;
}

export interface EditConfigData {
    id: string;
    ip: string;
    clientId: string;
    secretId: string;
    isActive?: boolean;
}
