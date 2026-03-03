import { Component, inject, signal } from '@angular/core';

import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer';

@Component({
  selector: 'app-customer-list',
  imports: [],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList {
  private customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);

    this.customerService.list().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load customers');
        this.loading.set(false);
      },
    });
  }
}
