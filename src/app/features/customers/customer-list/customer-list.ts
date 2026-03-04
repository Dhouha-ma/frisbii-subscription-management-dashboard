import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer';

@Component({
  selector: 'app-customer-list',
  imports: [DatePipe],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit {
  private customerService = inject(CustomerService);

  public customers = signal<Customer[]>([]);
  public loading = signal(false);
  public error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers() {
    this.loading.set(true);

    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        console.log('Customers:', customers);
        this.customers.set(customers);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load customers');
        this.loading.set(false);
      },
    });
  }
}
