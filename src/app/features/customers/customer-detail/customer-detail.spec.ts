import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { CustomerDetail } from './customer-detail';
import { SubscriptionState } from '../../../core/models/subscription.model';
import { InvoiceState } from '../../../core/models/Invoice.model';
import { MOCK_CUSTOMERS, MOCK_INVOICES, MOCK_SUBSCRIPTIONS } from '../../../mocks/mock-data';
import { SubscriptionService } from '../../../core/services/subscription';
import { CustomerService } from '../../../core/services/customer';
import { InvoiceService } from '../../../core/services/invoice';

describe('CustomerDetail', () => {
  let component: CustomerDetail;
  let fixture: ComponentFixture<CustomerDetail>;

  let subscriptionService: Pick<
    SubscriptionService,
    'pauseSubscription' | 'unpauseSubscription' | 'getSubscriptionByCustomer'
  >;
  let customerService: Pick<CustomerService, 'getCustomerByHandle'>;
  let invoiceService: Pick<InvoiceService, 'getInvoicesByCustomer'>;

  beforeEach(async () => {
    subscriptionService = {
      pauseSubscription: vi.fn(),
      unpauseSubscription: vi.fn(),
      getSubscriptionByCustomer: vi.fn(),
    };
    customerService = {
      getCustomerByHandle: vi.fn(),
    };
    invoiceService = {
      getInvoicesByCustomer: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CustomerDetail],
      providers: [
        provideRouter([]),
        { provide: SubscriptionService, useValue: subscriptionService },
        { provide: CustomerService, useValue: customerService },
        { provide: InvoiceService, useValue: invoiceService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('subscriptionBadge', () => {
    it('should return Active when state is active', () => {
      expect(component.subscriptionBadge('active')).toBe(SubscriptionState.Active);
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
      const subscription = MOCK_SUBSCRIPTIONS[0];

      component.subscriptions.set([subscription]);
      vi.mocked(subscriptionService.pauseSubscription).mockReturnValue(of(void 0));

      component.pauseSubscription(subscription);

      expect(subscriptionService.pauseSubscription).toHaveBeenCalledWith('sub-0002');
      expect(component.subscriptions()[0].state).toBe('on_hold');
      expect(component.subscriptionActionLoading()).toBeNull();
    });
  });

  describe('unpauseSubscription', () => {
    it('should unpause subscription successfully', () => {
      const subscription = { ...MOCK_SUBSCRIPTIONS[0], state: 'on_hold' as const };

      component.subscriptions.set([subscription]);
      vi.mocked(subscriptionService.unpauseSubscription).mockReturnValue(of(void 0));

      component.unpauseSubscription(subscription);

      expect(subscriptionService.unpauseSubscription).toHaveBeenCalledWith('sub-0002');
      expect(component.subscriptions()[0].state).toBe('active');
      expect(component.subscriptionActionLoading()).toBeNull();
    });
  });

  describe('invoiceBadge', () => {
    it('should return Paid when state is paid', () => {
      const result = component.invoiceBadge('created');

      expect(result).toBe(InvoiceState.Created);
    });

    it('should return Pending when state is pending', () => {
      const result = component.invoiceBadge('pending');

      expect(result).toBe(InvoiceState.Pending);
    });

    it('should return Failed when state is failed', () => {
      const result = component.invoiceBadge('failed');

      expect(result).toBe(InvoiceState.Failed);
    });

    it('should return Unknown for invalid state', () => {
      const result = component.invoiceBadge('random');

      expect(result).toBe(InvoiceState.Unknown);
    });

    it('should return Unknown when state is undefined', () => {
      const result = component.invoiceBadge(undefined);

      expect(result).toBe(InvoiceState.Unknown);
    });
  });

  describe('loadCustomer', () => {
    it('should load customer successfully', () => {
      const customer = MOCK_CUSTOMERS[0];

      component.customerLoading.set(false);
      component.customerError.set('some old error');

      vi.mocked(customerService.getCustomerByHandle).mockReturnValue(of(customer));

      component['loadCustomer']('cus-0001');

      expect(customerService.getCustomerByHandle).toHaveBeenCalledWith('cus-0001');
      expect(component.customer()).toEqual(customer);
      expect(component.customerError()).toBeNull();
      expect(component.customerLoading()).toBe(false);
    });
  });

  describe('loadInvoices', () => {
    it('should load invoices successfully', () => {
      vi.mocked(invoiceService.getInvoicesByCustomer).mockReturnValue(of(MOCK_INVOICES));

      component['loadInvoices']('cus-0001');

      expect(invoiceService.getInvoicesByCustomer).toHaveBeenCalledWith('cus-0001', 15);
      expect(component.invoices()).toEqual(MOCK_INVOICES);
      expect(component.invoicesError()).toBeNull();
      expect(component.invoicesLoading()).toBe(false);
    });
  });

  describe('loadSubscriptions', () => {
    it('should load subscriptions successfully', () => {
      vi.mocked(subscriptionService.getSubscriptionByCustomer).mockReturnValue(
        of(MOCK_SUBSCRIPTIONS),
      );

      component['loadSubscriptions']('cus-0001');

      expect(subscriptionService.getSubscriptionByCustomer).toHaveBeenCalledWith('cus-0001', 15);
      expect(component.subscriptions()).toEqual(MOCK_SUBSCRIPTIONS);
      expect(component.subscriptionsError()).toBeNull();
      expect(component.subscriptionsLoading()).toBe(false);
    });
  });
});
