import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'customers' },
  {
    path: 'customers',
    loadComponent: () =>
      import('./features/customers/customer-list/customer-list').then((m) => m.CustomerList),
  },
  {
    path: 'customers/:handle',
    loadComponent: () =>
      import('./features/customers/customer-detail/customer-detail').then((m) => m.CustomerDetail),
  },
  {
    path: 'subscriptions',
    loadComponent: () =>
      import('./features/subscriptions/subscription-list/subscription-list').then(
        (m) => m.SubscriptionList,
      ),
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./features/invoices/invoice-list/invoice-list').then((m) => m.InvoiceList),
  },
];
