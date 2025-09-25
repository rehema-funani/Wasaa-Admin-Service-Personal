export interface Business {
  id: string;
  tenant_id: string;
  name: string;
  type: "SME" | "Enterprise" | "NGO";
  registration_number?: string;
  country: string;
  status: "ONBOARDING" | "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "INCOMPLETE";
  verification_status: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  created_by?: {
    id: string;
    username: string | null;
    phone_number: string | null;
    email: string | null;
    profile_picture: string | null;
    first_name: string | null;
    last_name: string | null;
    kyc_level: string;
    dob: string | null;
  };

  // Optional fields seen in the UI mapping but might not be in every API response
  category?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  productsCount?: number;
  revenue?: number;
}