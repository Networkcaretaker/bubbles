export type ClientType = 'individual' | 'company' | 'yatch' | 'villa'

export interface ContactDetails {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface ClientDetails {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: ClientType;
    contacts: string[];
}