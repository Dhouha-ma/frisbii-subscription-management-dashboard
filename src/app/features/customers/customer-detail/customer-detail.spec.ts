import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { CustomerDetail } from './customer-detail';
import { SubscriptionState } from '../../../core/models/subscription.model';
import { MOCK_SUBSCRIPTION } from '../../../mocks/mock-data';
import { SubscriptionService } from '../../../core/services/subscription';

describe('CustomerDetail', () => {
  let component: CustomerDetail;
  let fixture: ComponentFixture<CustomerDetail>;
  let subscriptionService: any;

  beforeEach(async () => {
    subscriptionService = {
      pauseSubscription: vi.fn(),
      unpauseSubscription: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CustomerDetail],
      providers: [
        provideRouter([]),
        {
          provide: SubscriptionService,
          useValue: subscriptionService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetail);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('subscriptionBadge', () => {
    it('should return Active when state is active', () => {
      const result = component.subscriptionBadge('active');

      expect(result).toBe(SubscriptionState.Active);
    });

    it('should return Cancelled when state is cancelled', () => {
      const result = component.subscriptionBadge('cancelled');

      expect(result).toBe(SubscriptionState.Cancelled);
    });

    it('should return Expired when state is expired', () => {
      const result = component.subscriptionBadge('expired');

      expect(result).toBe(SubscriptionState.Expired);
    });

    it('should return OnHold when state is on_hold', () => {
      const result = component.subscriptionBadge('on_hold');

      expect(result).toBe(SubscriptionState.OnHold);
    });

    it('should handle uppercase values', () => {
      const result = component.subscriptionBadge('ACTIVE');

      expect(result).toBe(SubscriptionState.Active);
    });

    it('should return Unknown for invalid state', () => {
      const result = component.subscriptionBadge('random');

      expect(result).toBe(SubscriptionState.Unknown);
    });

    it('should return Unknown when state is undefined', () => {
      const result = component.subscriptionBadge(undefined);

      expect(result).toBe(SubscriptionState.Unknown);
    });
  });

  describe('pauseSubscription', () => {
    it('should pause subscription successfully', () => {
      const subscription = MOCK_SUBSCRIPTION[0];

      component.subscriptions.set([subscription]);

      subscriptionService.pauseSubscription.mockReturnValue(of(void 0));

      component.pauseSubscription(subscription as any);

      expect(subscriptionService.pauseSubscription).toHaveBeenCalledWith('sub-0002');
      expect(component.subscriptions()[0].state).toBe('on_hold');
      expect(component.subscriptionActionLoading()).toBeNull();
    });
  });

  // describe('unpauseSubscription', () => {});

  // describe('invoiceBadge', () => {});

  // describe('loadCustomer', () => {});

  // describe('loadInvoices', () => {});

  // describe('loadSubscriptions', () => {});
});
