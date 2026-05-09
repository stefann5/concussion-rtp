import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthed()) {
    router.navigate(['/login']);
    return false;
  }
  const required = route.data?.['roles'] as string[] | undefined;
  if (required && !required.includes(auth.role()!)) {
    router.navigate(['/forbidden']);
    return false;
  }
  return true;
};
