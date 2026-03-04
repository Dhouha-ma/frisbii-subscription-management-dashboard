import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer';

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

  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);

  ngOnInit() {
    this.getCustomerDetail();
  }

  private getCustomerDetail() {
    const handle = this.route.snapshot.paramMap.get('handle');

    if (!handle) return;

    this.loading.set(true);

    this.customerService.getCustomerByHandle(handle).subscribe({
      next: (data) => {
        this.customer.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Customer not found');
        this.loading.set(false);
      },
    });
  }
}
