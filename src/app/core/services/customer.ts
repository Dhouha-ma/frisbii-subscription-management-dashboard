import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Customer, PageList } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);

  getCustomers(size = 20): Observable<Customer[]> {
    return this.http
      .get<PageList<Customer>>(`${environment.apiUrl}/list/customer?size=${size}`)
      .pipe(map((result) => result.content));
  }

  getCustomerByHandle(handle: string): Observable<Customer> {
    return this.http.get<Customer>(`${environment.apiUrl}/customer/${handle}`);
  }
}
