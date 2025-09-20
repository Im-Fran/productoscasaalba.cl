export type AuthenticatedUser = User & {
  token: string;
}

export type User = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
}