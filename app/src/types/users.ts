export type roles = 'owner' | 'manager' | 'operator' | 'driver' | 'developer'

export interface UserDetails {
    uid: string;
    name: string;
    email: string;
    phone: string;
    role: roles;
}
