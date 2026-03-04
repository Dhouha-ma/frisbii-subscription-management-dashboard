import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer';
import { InvoiceService } from '../../../core/services/invoice';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Invoice, InvoiceState } from '../../../core/models/Invoice.model';

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

  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private invoiceService = inject(InvoiceService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const handle = this.route.snapshot.paramMap.get('handle');

    if (!handle) {
      this.error.set('Invalid customer handle');
      return;
    }

    this.loadCustomer(handle);
    this.loadInvoices(handle);
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
      .getInvoicesByCustomer(customerHandle, 20)
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
}
