import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, map, catchError, throwError, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  list(size = 10, page = 0): Observable<Customer[]> {
    return this.http
      .get<{ content: Customer[] }>(`${this.apiUrl}/customer/list?size=${size}&page=${page}`)
      .pipe(
        map((res) => res.content),
        catchError((error) => {
          console.error('Customer list error', error);
          return throwError(() => error);
        }),
        shareReplay(1),
      );
  }

  get(handle: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customer/${handle}`);
  }

  create(payload: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customer`, payload);
  }
}
