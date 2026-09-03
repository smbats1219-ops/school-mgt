export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  status: string;
  roles?: string[];
}
