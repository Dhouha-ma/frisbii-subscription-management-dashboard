import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { paginate } from '../../../shared/utils/pagination.util';

@Component({
  selector: 'app-customer-list',
  imports: [DatePipe, RouterLink, SearchInput, Pagination],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit {
  public loading = signal(false);
  public error = signal<string | null>(null);
  public page = signal(1);
  public pageSize = signal(10);

  private customers = signal<Customer[]>([]);
  private searchTerm = signal('');

  private customerService = inject(CustomerService);

  public filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return this.customers();

    return this.customers().filter((customer) => customer.handle.toLowerCase().includes(term));
  });

  public paginatedCustomers = paginate(this.filteredCustomers, this.page, this.pageSize);

  ngOnInit() {
    this.loadCustomers();
  }

  public handleSearch(value: string) {
    this.searchTerm.set(value);
    this.page.set(1);
  }

  public handlePageChange(page: number) {
    this.page.set(page);
  }

  private loadCustomers() {
    this.loading.set(true);
    this.error.set(null);

    this.customerService.getCustomers(30).subscribe({
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
