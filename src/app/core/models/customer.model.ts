export interface Customer {
  handle: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  created: string;
}

export interface PageList<T> {
  size: number;
  count: number;
  from: string;
  to: string;
  next_page_token?: string;
  content: T[];
}
