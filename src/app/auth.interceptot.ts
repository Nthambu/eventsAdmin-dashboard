import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Auth } from "./services/auth";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(Auth);
  const token = authService.getToken();
  const router = inject(Router);

  // Skip auth routes — never attach token or trigger logout for these
  const isAuthRoute = req.url.includes('/user/login') || req.url.includes('/user/verify');
  if (isAuthRoute) {
    return next(req);
  }

  // Clone the request and attach the JWT if present
  let secureReq = req;
  if (token) {
    secureReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(secureReq).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Log details so you can debug what is actually failing
        console.error('[Auth Interceptor] 401 Unauthorized', {
          url: error.url,
          message: error.error?.message,
          hasToken: !!token
        });
        authService.logout();
        router.navigate(['/login'], {
          queryParams: { sessionExpired: true }
        });
      }
      return throwError(() => error);
    })
  );
}
