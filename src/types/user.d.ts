export type AuthenticatedUser = User & {
  token: string;
  refresh_token: string;
}

export type User = {
  id: number;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  roles: string[];
}

export type UserSession = {
  id: number;
  device_type: string;
  browser: string;
  os: string;
  ip_address: string;
  last_activity: string;
  created_at: string;
  expires_at: string;
}