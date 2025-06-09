import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const platformId = inject(PLATFORM_ID);


  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem('token') !== null) {
      return true;
    } else {
      _Router.navigate(['/login']);
      return false;
    }
  } else {
    _Router.navigate(['/login']);
    return false;
  }
};
