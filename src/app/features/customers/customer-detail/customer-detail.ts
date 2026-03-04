import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer';
import { InvoiceService } from '../../../core/services/invoice';
import { Invoice, InvoiceState } from '../../../core/models/Invoice.model';
import { SubscriptionService } from '../../../core/services/subscription';
import { Subscription, SubscriptionState } from '../../../core/models/subscription.model';

@Component({
  selector: 'app-customer-detail',
  imports: [DatePipe],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
})
export class CustomerDetail implements OnInit {
  public customer = signal<Customer | null>(null);
  public loading = signal(false);
  public error = signal<string | null>(null);

  public invoicesLoading = signal(false);
  public invoicesError = signal<string | null>(null);
  public invoices = signal<Invoice[]>([]);

  public subscriptionsLoading = signal(false);
  public subscriptionsError = signal<string | null>(null);
  public subscriptions = signal<Subscription[]>([]);
  public subscriptionActionLoading = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private invoiceService = inject(InvoiceService);
  private subscriptionService = inject(SubscriptionService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const handle = this.route.snapshot.paramMap.get('handle');

    if (!handle) {
      this.error.set('Invalid customer handle');
      return;
    }

    this.loadCustomer(handle);
    this.loadInvoices(handle);
    this.loadSubscriptions(handle);
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
    this.loading.set(true);
    this.error.set(null);

    this.customerService
      .getCustomerByHandle(handle)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customer) => {
          this.customer.set(customer);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load customer');
          this.loading.set(false);
        },
      });
  }

  private loadInvoices(customerHandle: string) {
    this.invoicesLoading.set(true);
    this.invoicesError.set(null);

    this.invoiceService
      .getInvoicesByCustomer(customerHandle, 10)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.invoices.set(list);
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
      .getSubscriptionByCustomer(customerHandle, 10)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.subscriptions.set(list);
          this.subscriptionsLoading.set(false);
        },
        error: () => {
          this.subscriptionsError.set('Failed to load invoices');
          this.subscriptionsLoading.set(false);
        },
      });
  }
}
