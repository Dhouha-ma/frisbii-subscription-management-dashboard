import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { PageList, Subscription } from '../models/subscription.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private http = inject(HttpClient);

  public getSubscriptionByCustomer(customerHandle: string, size = 10): Observable<Subscription[]> {
    return this.http
      .get<
        PageList<Subscription>
      >(`${environment.apiUrl}/list/subscription?customer=${customerHandle}&size=${size}`)
      .pipe(map((result) => result.content));
  }

  public pauseSubscription(handle: string) {
    return this.http.post<void>(`${environment.apiUrl}/subscription/${handle}/on_hold`, {});
  }

  public unpauseSubscription(handle: string) {
    return this.http.post<void>(`${environment.apiUrl}/subscription/${handle}/reactivate`, {});
  }
}
