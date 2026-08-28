import {inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {CanActivateFn, Router} from '@angular/router';
import {LocalStorage} from '../services/local-storage';

export const workerAuthGuard: CanActivateFn = () => {
  const storage = inject(LocalStorage);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (storage.loggedInProviderId()) {
    return true;
  }

  if (isPlatformBrowser(platformId)) {
    try {
      const stored = localStorage.getItem('loggedInProviderId');
      if (stored) {
        storage.loggedInProviderId.set(stored);
        return true;
      }
    } catch {
      // Ignore storage errors
    }
  }

  return router.parseUrl('/worker-login');
};
