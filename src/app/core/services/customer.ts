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

    return this.http
      .get<PageList<Customer>>(`${environment.apiUrl}/list/customer`, { params })
      .pipe(
        map((result) => result.content),
        shareReplay(1),
        catchError(handleHttpError('Failed to load customers')),
      );
  }

  public getCustomerByHandle(handle: string): Observable<Customer> {
    return this.http
      .get<Customer>(`${environment.apiUrl}/customer/${handle}`)
      .pipe(catchError(handleHttpError('Failed to load customer')));
  }
}
