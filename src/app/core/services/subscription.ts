import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map, Observable, shareReplay } from 'rxjs';

import { PageList, Subscription } from '../models/subscription.model';
import { environment } from '../../../environments/environment';
import { handleHttpError } from '../../shared/utils/http-error.util';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);

  public getSubscriptionByCustomer(customerHandle: string, size = 10): Observable<Subscription[]> {
    const params = new HttpParams().set('customer', customerHandle).set('size', size);

    return this.http
      .get<PageList<Subscription>>(`${environment.apiUrl}/list/subscription`, { params })
      .pipe(
        map((result) => result.content),
        shareReplay(1),
        catchError(handleHttpError('Failed to load subscriptions')),
      );
  }

  public pauseSubscription(handle: string) {
    return this.http
      .post<void>(`${environment.apiUrl}/subscription/${handle}/on_hold`, {})
      .pipe(catchError(handleHttpError('Failed to pause subscription')));
  }

  public unpauseSubscription(handle: string) {
    return this.http
      .post<void>(`${environment.apiUrl}/subscription/${handle}/reactivate`, {})
      .pipe(catchError(handleHttpError('Failed to unpause subscription')));
  }
}
