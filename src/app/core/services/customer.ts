import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, catchError, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Customer, PageList } from '../models/customer.model';
import { handleHttpError } from '../../shared/utils/http-error.util';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);

  public getCustomers(size = 20): Observable<Customer[]> {
    const params = new HttpParams().set('size', size);
    const url = `${environment.apiUrl}/list/customer`;

    return this.http.get<PageList<Customer>>(url, { params }).pipe(
      map((result) => result.content),
      shareReplay(1),
      catchError(handleHttpError('Failed to load customers')),
    );
  }

  public getCustomerByHandle(handle: string): Observable<Customer> {
    const url = `${environment.apiUrl}/customer/${handle}`;

    return this.http
      .get<Customer>(url)
      .pipe(catchError(handleHttpError('Failed to load customer')));
  }
}
