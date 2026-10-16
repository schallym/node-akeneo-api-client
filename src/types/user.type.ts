export type User = {
  uuid: string;
  email: string;
  enabled: boolean;
  first_name: string | null;
  last_name: string | null;
  roles: string[];
  groups: string[];
};
