export interface PageList<T> {
  content: T[];
}

export interface Invoice {
  id?: string;
  handle: string;
  state?: string;
  amount?: number;
  currency?: string;
  created: string;
}

export enum InvoiceState {
  Created = 'created',
  Pending = 'pending',
  Settled = 'settled',
  Authorized = 'authorized',
  Failed = 'failed',
  Unknown = 'unknown',
}
