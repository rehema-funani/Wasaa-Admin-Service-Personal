export interface AuditLog {
  _id: string;
  user_id: string;
  username: string;
  ip_address: string;
  service_name: string;
  status_code: number;
  session_id?: string;
  user_email?: string;
  event_type: string;
  event_description: string;
  entity_affected: string;
  entity_id: string;
  http_method: string;
  request_url: string;
  query_params: string;
  request_body: any;
  response_body: any;
  execution_time: number;
  location: string;
  user_agent: string;
  device_type: string;
  device_model: string;
  os: string;
  browser: string;
  auth_method: string;
  roles: string;
  permissions: string;
  is_successful: boolean;
  __v: number;
  createdAt: string;
  timestamp?: string;
}

export interface AuditLog {
  _id: string;
  user_id: string;
  username: string;
  ip_address: string;
  service_name: string;
  status_code: number;
  session_id?: string;
  user_email?: string;
  event_type: string;
  event_description: string;
  entity_affected: string;
  entity_id: string;
  http_method: string;
  request_url: string;
  query_params: string;
  request_body: any;
  response_body: any;
  execution_time: number;
  location: string;
  user_agent: string;
  device_type: string;
  device_model: string;
  os: string;
  browser: string;
  auth_method: string;
  roles: string;
  permissions: string;
  is_successful: boolean;
  timestamp?: string;
  __v: number;
}

export interface FlaggedContact {
  _count: {
    contact_id: number;
  };
  contact_id: string;
  user_details: {
    id: string;
    username: string;
    phone_number: string;
    email: string;
    profile_picture: string | null;
    profile_background: string | null;
    first_name: string | null;
    last_name: string | null;
    kyc_status: boolean;
    preferences: any;
    devices: Array<{
      id: number;
      fcm_token: string;
      trust_status: string;
    }>;
  };
  flagged_by?: {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
  }[];
  reason?: string;
  status?: "pending" | "reviewed" | "cleared";
  flagged_at?: string;
}