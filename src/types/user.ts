export interface User {
    id: string;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone_number: string | null;
    is_verified: boolean;
    kyc_status: boolean;
    city: string | null;
    town: string | null;
    country: string | null;
    about: string | null;
    dob: string | null;
    country_code: string | null;
    gender: string | null;
    passport_photo: string | null;
    avatar_id: string | null;
    identity_type: string | null;
    identity_number: string | null;
    verification_status: string;
    account_status: string;
    fcm_token: string;
    last_login: string | null;
    id_front: string | null;
    id_back: string | null;
    profile_picture: string | null;
    profile_background: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface UserAdmin {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    lastActive?: string;
    last_login?: string;
    status?: string;
    role?: any;
    mfa_enabled?: boolean;
    phone_number?: string;
    location?: string;
    createdAt?: string;
    transactions_count?: number;
    avatar?: string;
    roleId?: string;
    permissions?: string[];
};


export interface Role {
    id: string;
    title: string;
    description: string;
    permissions: string[];
    status: string;
    userCount: number;
    createdAt: string;
    updatedAt: string;
}