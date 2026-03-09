import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer';
import { InvoiceService } from '../../../core/services/invoice';
import { Invoice, InvoiceState } from '../../../core/models/Invoice.model';
import { SubscriptionService } from '../../../core/services/subscription';
import { Subscription, SubscriptionState } from '../../../core/models/subscription.model';
import { StateBadge } from '../../../shared/components/state-badge/state-badge';
import { ActionButton } from '../../../shared/components/action-button/action-button';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { paginate } from '../../../shared/utils/pagination.util';

@Component({
  selector: 'app-customer-detail',
  imports: [DatePipe, StateBadge, ActionButton, Pagination],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
})
export class CustomerDetail implements OnInit {
  public customer = signal<Customer | null>(null);
  public customerLoading = signal(false);
  public customerError = signal<string | null>(null);

  public invoicesLoading = signal(false);
  public invoicesError = signal<string | null>(null);
  public invoices = signal<Invoice[]>([]);
  public invoicesPage = signal(1);
  public invoicesPageSize = signal(5);
  public paginatedInvoices = paginate(this.invoices, this.invoicesPage, this.invoicesPageSize);

  public subscriptionsLoading = signal(false);
  public subscriptionsError = signal<string | null>(null);
  public subscriptions = signal<Subscription[]>([]);
  public subscriptionActionLoading = signal<string | null>(null);
  public subscriptionsPage = signal(1);
  public subscriptionsPageSize = signal(5);
  public paginatedSubscriptions = paginate(
    this.subscriptions,
    this.subscriptionsPage,
    this.subscriptionsPageSize,
  );

  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private invoiceService = inject(InvoiceService);
  private subscriptionService = inject(SubscriptionService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const handle = this.route.snapshot.paramMap.get('handle');

    if (!handle) {
      this.customerError.set('Invalid customer handle');
      return;
    }

    this.loadCustomer(handle);
    this.loadInvoices(handle);
    this.loadSubscriptions(handle);
  }

  public handleInvoicesPageChange(page: number) {
    this.invoicesPage.set(page);
  }

  public handleSubscriptionsPageChange(page: number) {
    this.subscriptionsPage.set(page);
  }

  public subscriptionBadge(state?: SubscriptionState): SubscriptionState {
    const subscriptionState = (state ?? '').toLowerCase() as SubscriptionState;

    switch (subscriptionState) {
      case SubscriptionState.Active:
        return SubscriptionState.Active;
      case SubscriptionState.Cancelled:
        return SubscriptionState.Cancelled;
      case SubscriptionState.Expired:
        return SubscriptionState.Expired;
      case SubscriptionState.OnHold:
        return SubscriptionState.OnHold;
      default:
        return SubscriptionState.Unknown;
    }
  }

  public pauseSubscription(subscription: Subscription) {
    this.subscriptionActionLoading.set(subscription.handle);
    this.subscriptionsError.set(null);

    this.subscriptionService
      .pauseSubscription(subscription.handle)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.updateSubscription(subscription, SubscriptionState.OnHold);
          this.subscriptionActionLoading.set(null);
        },
        error: (error: Error) => {
          this.subscriptionsError.set(error.message);
          this.subscriptionActionLoading.set(null);
        },
      });
  }

  public unpauseSubscription(subscription: Subscription) {
    this.subscriptionActionLoading.set(subscription.handle);
    this.subscriptionsError.set(null);

    this.subscriptionService
      .unpauseSubscription(subscription.handle)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.updateSubscription(subscription, SubscriptionState.Active);
          this.subscriptionActionLoading.set(null);
        },
        error: (error: Error) => {
          this.subscriptionsError.set(error.message);
          this.subscriptionActionLoading.set(null);
        },
      });
  }

  public invoiceBadge(state?: InvoiceState): InvoiceState {
    const invoiceState = (state ?? '').toLowerCase() as InvoiceState;

    if (Object.values(InvoiceState).includes(invoiceState)) {
      return invoiceState;
    }

    return InvoiceState.Unknown;
  }

  private updateSubscription(subscription: Subscription, state: SubscriptionState) {
    this.subscriptions.update((list) =>
      list.map((sub) => (sub.handle === subscription.handle ? { ...sub, state } : sub)),
    );
  }

  private loadCustomer(handle: string) {
    this.customerLoading.set(true);
    this.customerError.set(null);

    this.customerService
      .getCustomerByHandle(handle)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customer) => {
          this.customer.set(customer);
          this.customerLoading.set(false);
        },
        error: (error: Error) => {
          this.customerError.set(error.message);
          this.customerLoading.set(false);
        },
      });
  }

  private loadInvoices(customerHandle: string) {
    const listSize = 15;
    this.invoicesLoading.set(true);
    this.invoicesError.set(null);

    this.invoiceService
      .getInvoicesByCustomer(customerHandle, listSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.invoices.set(list);
          this.invoicesPage.set(1);
          this.invoicesLoading.set(false);
        },
        error: (error: Error) => {
          this.invoicesError.set(error.message);
          this.invoicesLoading.set(false);
        },
      });
  }

  private loadSubscriptions(customerHandle: string) {
    const listSize = 15;
    this.subscriptionsLoading.set(true);
    this.subscriptionsError.set(null);

    this.subscriptionService
      .getSubscriptionByCustomer(customerHandle, listSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.subscriptions.set(list);
          this.subscriptionsPage.set(1);
          this.subscriptionsLoading.set(false);
        },
        error: (error: Error) => {
          this.subscriptionsError.set(error.message);
          this.subscriptionsLoading.set(false);
        },
      });
  }
}
