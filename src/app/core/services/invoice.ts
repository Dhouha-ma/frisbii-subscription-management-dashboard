import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, catchError, map, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Invoice, PageList } from '../models/Invoice.model';
import { handleHttpError } from '../../shared/utils/http-error.util';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);

  public getInvoicesByCustomer(customerHandle: string, size = 10): Observable<Invoice[]> {
    const params = new HttpParams().set('customer', customerHandle).set('size', size);
    const url = `${environment.apiUrl}/list/invoice`;

    return this.http.get<PageList<Invoice>>(url, { params }).pipe(
      map((result) => result.content),
      shareReplay(1),
      catchError(handleHttpError('Failed to load invoices')),
    );
  }
}
