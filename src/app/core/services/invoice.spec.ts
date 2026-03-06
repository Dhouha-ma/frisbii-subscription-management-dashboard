import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { InvoiceService } from './invoice';
import { environment } from '../../../environments/environment';
import { Invoice } from '../models/Invoice.model';
import { MOCK_INVOICES } from '../../mocks/mock-data';

describe('Invoice', () => {
  let service: InvoiceService;
  let httpMock: HttpTestingController;
  const mockInvoices = MOCK_INVOICES;

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
