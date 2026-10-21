export type Supplier = {
  code: string;
  name: string;
  portal_uuid: string | null;
  default_channel_code: string | null;
  default_locale_code: string | null;
  avatar_file_key: string | null;
};

export type SupplierUser = {
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string | null;
  last_logged_in: string | null;
};
