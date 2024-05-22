import {HttpInterceptorFn} from "@angular/common/http";

export const CustomInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem("token");

  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(cloneRequest);
}
