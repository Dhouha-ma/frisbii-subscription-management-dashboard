import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = btoa(`${environment.apiKey}:`);

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Basic ${token}`,
      },
    }),
  );
};
