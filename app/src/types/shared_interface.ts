export interface SocialLinks {
    facebook?: string;
    whatsapp?: string;
    linkedin?: string;
}

export interface Address {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
}

export interface Times { start: string; end: string }