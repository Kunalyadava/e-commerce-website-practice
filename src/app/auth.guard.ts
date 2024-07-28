import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const token: any = localStorage.getItem('isloggedIn');
  const isLogged = JSON.parse(token);
  if (!isLogged || isLogged === null) {
    _router.navigate(['']);
    return false;
  }
  return true;
};