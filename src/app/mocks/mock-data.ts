import { Customer } from '../core/models/customer.model';
import { Invoice } from '../core/models/Invoice.model';
import { Subscription } from '../core/models/subscription.model';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    handle: 'cust-0100',
    first_name: 'Janeva',
    last_name: 'Rauprich',
    email: 'jrauprich2r@indiegogo.com',
    company: 'Tazzy',
    created: '2024-01-01T10:00:00Z',
  },
  {
    handle: 'cust-0099',
    first_name: 'Fayette ',
    last_name: 'Van den Velde',
    email: 'fvandenvelde2q@nature.com',
    company: 'Yata',
    created: '2024-01-02T10:00:00Z',
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    handle: 'inv-44',
    state: 'settled',
    amount: 9343,
    currency: 'USD',
    created: '2024-01-10T10:00:00Z',
  },
  {
    handle: 'inv-43',
    state: 'pending',
    amount: 8385,
    currency: 'USD',
    created: '2024-01-12T10:00:00Z',
  },
];

export const MOCK_SUBSCRIPTION: Subscription[] = [
  {
    handle: 'sub-0002',
    state: 'active',
    plan: 'p-1772522716092',
    created: '2024-01-01T10:00:00Z',
  },
  {
    handle: 's-1772522743983',
    state: 'on_hold',
    plan: 'p-1772522716660',
    created: '2024-01-05T10:00:00Z',
  },
];
