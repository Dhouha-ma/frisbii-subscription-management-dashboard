export interface PageList<T> {
  content: T[];
}

export interface Subscription {
  handle: string;
  state?: string;
  plan?: string;
  created: string;
}

export enum SubscriptionState {
  Active = 'active',
  Cancelled = 'cancelled',
  Expired = 'expired',
  OnHold = 'on_hold',
  Unknown = 'unknown',
}
