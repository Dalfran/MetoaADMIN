import {
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  HttpInterceptorFn
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn =
  (req, next) => {

    const platformId =
      inject(PLATFORM_ID);

    /**
     * Pendant le SSR, il n'existe pas
     * de localStorage.
     */
    if (!isPlatformBrowser(platformId)) {

      return next(req);
    }

    const token =
      localStorage.getItem(
        'metoa_token'
      );

    if (!token) {

      return next(req);
    }

    const clonedRequest =
      req.clone({

        setHeaders: {
          Authorization:
            `Bearer ${token}`
        }

      });

    return next(
      clonedRequest
    );
  };
