import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { CustomerList } from './customer-list';
import { MOCK_CUSTOMERS } from '../../../mocks/mock-data';
import { CustomerService } from '../../../core/services/customer';

describe('CustomerList', () => {
  let component: CustomerList;
  let fixture: ComponentFixture<CustomerList>;
  let customerService: any;

  beforeEach(async () => {
    customerService = {
      getCustomers: vi.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [CustomerList],
      providers: [
        {
          provide: CustomerService,
          useValue: customerService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleSearch', () => {
    beforeEach(() => {
      component['customers'].set(MOCK_CUSTOMERS as any);
      component.filteredCustomers.set(MOCK_CUSTOMERS as any);
    });

    it('should reset filteredCustomers when search term is empty', () => {
      component.filteredCustomers.set([{ handle: 'temp' }] as any);

      component.handleSearch('');

      expect(component.filteredCustomers()).toEqual(component['customers']());
    });

    it('should filter customers by handle', () => {
      component.handleSearch('cust-0100');

      expect(component.filteredCustomers()).toEqual([MOCK_CUSTOMERS[0]]);
    });

    it('should filter customers by partial handle', () => {
      component.handleSearch('0100');

      expect(component.filteredCustomers()).toEqual([MOCK_CUSTOMERS[0]]);
    });

    it('should return empty array when no customer matches', () => {
      component.handleSearch('missing');

      expect(component.filteredCustomers()).toEqual([]);
    });
  });

  describe('loadCustomers', () => {
    it('should load customers successfully', () => {
      customerService.getCustomers.mockReturnValue(of(MOCK_CUSTOMERS));

      component['loadCustomers']();

      expect(customerService.getCustomers).toHaveBeenCalledWith(20);
      expect(component['customers']()).toEqual(MOCK_CUSTOMERS);
      expect(component.filteredCustomers()).toEqual(MOCK_CUSTOMERS);
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
    });
  });
});
