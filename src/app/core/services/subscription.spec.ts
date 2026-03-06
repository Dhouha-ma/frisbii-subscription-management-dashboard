import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SubscriptionService } from './subscription';
import { environment } from '../../../environments/environment';
import { Subscription } from '../models/subscription.model';

describe('Subscription', () => {
  let service: SubscriptionService;
  let httpMock: HttpTestingController;
  const mockSubscriptions: Subscription[] = [
    {
      handle: 'sub-0002',
      state: 'active',
      plan: 'p-1772522716092',
      created: '2024-01-01T10:00:00Z',
    },
    {
      handle: 's-1772522743983',
      state: 'on_hold',
      plan: 'p-1772522716660',
      created: '2024-01-05T10:00:00Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriptionService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSubscriptionByCustomer', () => {
    it('should return subscriptions for a customer', () => {
      const customerHandle = 'cust-0100';
      let result: Subscription[] | undefined;

      service.getSubscriptionByCustomer(customerHandle).subscribe((subs) => {
        result = subs;
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/list/subscription?customer=${customerHandle}&size=10`,
      );

      expect(req.request.method).toBe('GET');

      req.flush({
        content: mockSubscriptions,
      });

      expect(result).toEqual(mockSubscriptions);
    });
  });

  describe('pauseSubscription', () => {
    it('should pause a subscription', () => {
      const handle = 'sub-001';

      service.pauseSubscription(handle).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/subscription/${handle}/on_hold`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush(null);
    });
  });

  describe('unpauseSubscription', () => {
    it('should unpause a subscription', () => {
      const handle = 'sub-001';

      service.unpauseSubscription(handle).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/subscription/${handle}/reactivate`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush(null);
    });
  });
});
