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

  public subscriptionsLoading = signal(false);
  public subscriptionsError = signal<string | null>(null);
  public subscriptions = signal<Subscription[]>([]);
  public subscriptionActionLoading = signal<string | null>(null);
  public subscriptionsPage = signal(1);
  public subscriptionsPageSize = signal(5);

  public paginatedInvoices = computed(() => {
    const start = (this.invoicesPage() - 1) * this.invoicesPageSize();
    const end = start + this.invoicesPageSize();
    return this.invoices().slice(start, end);
  });

  public paginatedSubscriptions = computed(() => {
    const start = (this.subscriptionsPage() - 1) * this.subscriptionsPageSize();
    const end = start + this.subscriptionsPageSize();
    return this.subscriptions().slice(start, end);
  });

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

  public subscriptionBadge(state?: string): SubscriptionState {
    switch ((state ?? '').toLowerCase()) {
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

    this.subscriptionService.pauseSubscription(subscription.handle).subscribe({
      next: () => {
        this.subscriptions.update((list) =>
          list.map((sub) =>
            sub.handle === subscription.handle ? { ...sub, state: 'on_hold' } : sub,
          ),
        );
        this.subscriptionActionLoading.set(null);
      },
      error: () => {
        this.subscriptionsError.set('Failed to pause subscription');
        this.subscriptionActionLoading.set(null);
      },
    });
  }

  public unpauseSubscription(subscription: Subscription) {
    this.subscriptionActionLoading.set(subscription.handle);

    this.subscriptionService.unpauseSubscription(subscription.handle).subscribe({
      next: () => {
        this.subscriptions.update((list) =>
          list.map((sub) =>
            sub.handle === subscription.handle ? { ...sub, state: 'active' } : sub,
          ),
        );
        this.subscriptionActionLoading.set(null);
      },
      error: () => {
        this.subscriptionsError.set('Failed to unpause subscription');
        this.subscriptionActionLoading.set(null);
      },
    });
  }

  public invoiceBadge(state?: string): InvoiceState {
    const invoiceState = (state ?? '').toLowerCase();

    if (Object.values(InvoiceState).includes(invoiceState as InvoiceState)) {
      return invoiceState as InvoiceState;
    }

    return InvoiceState.Unknown;
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
        error: () => {
          this.customerError.set('Failed to load customer');
          this.customerLoading.set(false);
        },
      });
  }

  private loadInvoices(customerHandle: string) {
    this.invoicesLoading.set(true);
    this.invoicesError.set(null);

    this.invoiceService
      .getInvoicesByCustomer(customerHandle, 15)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.invoices.set(list);
          this.invoicesPage.set(1);
          this.invoicesLoading.set(false);
        },
        error: () => {
          this.invoicesError.set('Failed to load invoices');
          this.invoicesLoading.set(false);
        },
      });
  }

  private loadSubscriptions(customerHandle: string) {
    this.subscriptionsLoading.set(true);
    this.subscriptionsError.set(null);

    this.subscriptionService
      .getSubscriptionByCustomer(customerHandle, 15)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.subscriptions.set(list);
          this.subscriptionsPage.set(1);
          this.subscriptionsLoading.set(false);
        },
        error: () => {
          this.subscriptionsError.set('Failed to load invoices');
          this.subscriptionsLoading.set(false);
        },
      });
  }
}
