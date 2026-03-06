import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { InvoiceService } from './invoice';
import { environment } from '../../../environments/environment';
import { Invoice } from '../models/Invoice.model';

describe('Invoice', () => {
  let service: InvoiceService;
  let httpMock: HttpTestingController;
  const mockInvoices: Invoice[] = [
    {
      handle: 'inv-44',
      state: 'settled',
      amount: 9343,
      currency: 'USD',
      created: '2024-01-10T10:00:00Z',
    },
    {
      handle: 'inv-43',
      state: 'pending',
      amount: 8385,
      currency: 'USD',
      created: '2024-01-12T10:00:00Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvoiceService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InvoiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInvoicesByCustomer', () => {
    it('should return invoices for a customer', () => {
      const customerHandle = 'cust-0100';
      let result: Invoice[] | undefined;

      service.getInvoicesByCustomer(customerHandle).subscribe((invoices) => {
        result = invoices;
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/list/invoice?customer=${customerHandle}&size=10`,
      );

      expect(req.request.method).toBe('GET');

      req.flush({
        content: mockInvoices,
      });

      expect(result).toEqual(mockInvoices);
    });
  });
});
