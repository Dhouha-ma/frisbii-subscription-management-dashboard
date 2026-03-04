import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer';
import { SearchInput } from '../../../shared/components/search-input/search-input';

@Component({
  selector: 'app-customer-list',
  imports: [DatePipe, RouterLink, SearchInput],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit {
  public filteredCustomers = signal<Customer[]>([]);
  public loading = signal(false);
  public error = signal<string | null>(null);

  private customers = signal<Customer[]>([]);
  private customerService = inject(CustomerService);

  ngOnInit() {
    this.loadCustomers();
  }

  public handleSearch(value: string) {
    const term = value.toLowerCase();

    if (!term) {
      this.filteredCustomers.set(this.customers());
      return;
    }

    const filtered = this.customers().filter((customer) =>
      customer.handle.toLowerCase().includes(term),
    );

    this.filteredCustomers.set(filtered);
  }

  private loadCustomers() {
    this.loading.set(true);

    this.customerService.getCustomers(20).subscribe({
      next: (data) => {
        this.customers.set(data);
        this.filteredCustomers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load customers');
        this.loading.set(false);
      },
    });
  }
}
