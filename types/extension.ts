export interface ExtensionAPI {
    id: string;
    number: string
    callerIdName: string
    emailAddr: string
    mobileNumber: string
    timezone: string
    balance: string
    budget?: {
        id: string;
        label: string;
        amount: string;
    }
    service?: {
        id: string;
        label: string;
        description: string;
    }
}

export interface ExtensionListResponse {
    data: ExtensionAPI[];
}