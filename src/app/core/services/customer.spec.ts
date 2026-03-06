import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CustomerService } from './customer';
import { environment } from '../../../environments/environment';
import { Customer, PageList } from '../models/customer.model';

describe('Customer', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  const mockCustomers: Customer[] = [
    {
      handle: 'cust-0100',
      first_name: 'Janeva',
      last_name: 'Rauprich',
      email: 'jrauprich2r@indiegogo.com',
      company: 'Tazzy',
      created: '2024-01-01T10:00:00Z',
    },
    {
      handle: 'cust-0099',
      first_name: 'Fayette ',
      last_name: 'Van den Velde',
      email: 'fvandenvelde2q@nature.com',
      company: 'Yata',
      created: '2024-01-02T10:00:00Z',
    },
  ];
  const mockResponse: PageList<Customer> = {
    content: mockCustomers,
  } as PageList<Customer>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCustomers', () => {
    it('should return customers content from the API response', () => {
      let result: Customer[] | undefined;

      service.getCustomers().subscribe((customers) => {
        result = customers;
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/list/customer?size=20`);

      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);

      expect(result).toEqual(mockCustomers);
    });
  });

  describe('getCustomerByHandle', () => {
    it('should return a customer by handle', () => {
      const handle = 'cust-0100';
      let result: Customer | undefined;

      service.getCustomerByHandle(handle).subscribe((customer) => {
        result = customer;
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/customer/${handle}`);

      expect(req.request.method).toBe('GET');

      req.flush(mockCustomers[0]);

      expect(result).toEqual(mockCustomers[0]);
    });
  });
});
