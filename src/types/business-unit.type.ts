export type BusinessUnit = {
  uuid: string;
  code: string;
  labels: { [localeCode: string]: string | null };
  groups: string[];
  roles: string[];
  created_at: string;
  updated_at: string | null;
};
