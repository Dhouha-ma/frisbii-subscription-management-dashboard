import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PageList } from '../models/customer.model';
import { Invoice } from '../models/Invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);

  public getInvoicesByCustomer(customerHandle: string, size = 20): Observable<Invoice[]> {
    return this.http
      .get<
        PageList<Invoice>
      >(`${environment.apiUrl}/list/invoice?customer=${encodeURIComponent(customerHandle)}&size=${size}`)
      .pipe(map((result) => result.content));
  }
}
