import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export function handleHttpError(message: string) {
  return (error: HttpErrorResponse): Observable<never> => {
    return throwError(() => new Error(error.error?.message || message));
  };
}
