import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

  const modifiedRequest = req.clone({
    setHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  return next(modifiedRequest);
};