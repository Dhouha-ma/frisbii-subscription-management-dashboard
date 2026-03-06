import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { CustomerList } from './customer-list';
import { MOCK_CUSTOMERS } from '../../../mocks/mock-data';
import { CustomerService } from '../../../core/services/customer';

describe('CustomerList', () => {
  let component: CustomerList;
  let fixture: ComponentFixture<CustomerList>;
  let customerService: { getCustomers: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    customerService = {
      getCustomers: vi.fn(),
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleSearch', () => {
    it('should update searchTerm and reset page to 1', () => {
      component.page.set(3);

      component.handleSearch('Janeva');

      expect(component['searchTerm']()).toBe('Janeva');
      expect(component.page()).toBe(1);
    });

    it('should allow empty search term and reset page', () => {
      component.page.set(5);

      component.handleSearch('');

      expect(component['searchTerm']()).toBe('');
      expect(component.page()).toBe(1);
    });
  });

  describe('loadCustomers', () => {
    it('should load customers successfully', () => {
      customerService.getCustomers.mockReturnValue(of(MOCK_CUSTOMERS));

      component['loadCustomers']();

      expect(customerService.getCustomers).toHaveBeenCalledWith(30);
      expect(component['customers']()).toEqual(MOCK_CUSTOMERS);
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
    });
  });
});
