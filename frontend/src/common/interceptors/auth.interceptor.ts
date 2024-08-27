import {inject} from "@angular/core";
import {HttpInterceptorFn} from "@angular/common/http";
import {Router} from "@angular/router";
import {CookieService} from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = cookieService.get('x-access-token');

  if (!token) {
    router.navigate(['/auth']);

    return next(req);
  }

  const interceptedReq = req.clone({
    setHeaders: { ['x-access-token']: token },
  });

  return next(interceptedReq);
}
