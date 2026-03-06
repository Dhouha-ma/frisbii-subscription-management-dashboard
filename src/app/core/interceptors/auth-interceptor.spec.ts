import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('authentication interceptor', () => {
    it('should add Authorization header', () => {
      http.get('/test').subscribe();
      const req = httpMock.expectOne('/test');
      const expectedToken = btoa(`${environment.apiKey}:`);

      expect(req.request.headers.get('Authorization')).toBe(`Basic ${expectedToken}`);

      req.flush({});
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
