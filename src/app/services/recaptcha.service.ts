import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Type declarations for reCAPTCHA v3
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private scriptLoaded = false;
  private scriptLoadingPromise: Promise<void> | null = null;

  /**
   * Dynamically loads the reCAPTCHA v3 script
   * @returns Promise that resolves when the script is loaded
   */
  private loadScript(): Promise<void> {
    if (!this.isBrowser) {
      return Promise.reject(new Error('reCAPTCHA script can only be loaded in browser context'));
    }

    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise<void>((resolve, reject) => {
      // Check if script is already in the DOM
      if (document.querySelector('script[src*="recaptcha/api.js"]')) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${environment.recaptchaSiteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = () => {
        this.scriptLoadingPromise = null;
        reject(new Error('Failed to load reCAPTCHA script'));
      };
      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  /**
   * Generates a reCAPTCHA v3 token for the given action
   * @param action The action name for the reCAPTCHA token (e.g., 'signup', 'login', 'submit')
   * @returns Observable that emits the token string
   *
   * Note: The token should be sent to your backend for validation.
   * Backend should verify the token by making a POST request to:
   * https://www.google.com/recaptcha/api/siteverify
   * with parameters: secret (your secret key), response (the token)
   */
  execute(action: string): Observable<string> {
    if (!this.isBrowser) {
      return throwError(
        () => new Error('reCAPTCHA token generation can only be executed in browser context')
      );
    }

    if (!action) {
      return throwError(() => new Error('Action parameter is required'));
    }

    return from(this.loadScript()).pipe(
      switchMap(() => {
        return new Promise<string>((resolve, reject) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(environment.recaptchaSiteKey, { action })
              .then((token: string) => {
                resolve(token);
              })
              .catch((error: Error) => {
                reject(error);
              });
          });
        });
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
