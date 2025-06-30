export type PaginatedResponse<T> = {
  _links: {
    self: { href: string };
    first: { href: string };
    previous?: { href: string };
    next?: { href: string };
  };
  current_page: number;
  _embedded: {
    items: T[];
  };
  items_count?: number;
};
