import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CookieService } from './cookie.service';

// Type declarations for Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[][];
  }
}

interface ConversionEventParams extends Record<string, unknown> {
  send_to: string;
  value: number;
  currency: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  private scriptLoaded = false;
  private scriptLoadingPromise: Promise<void> | null = null;

  constructor() {
    // Watch for consent changes and reload/unload scripts accordingly
    if (this.isBrowser) {
      effect(() => {
        // Trigger effect when showCookieManager changes (indicating consent change)
        const showManager = this.cookieService.showCookieManager();
        // When cookie manager is hidden, check if consent was given or rejected
        if (!showManager) {
          this.checkAndUpdateScriptState();
        }
      });

      // Initialize based on current consent status
      if (this.hasConsent()) {
        this.loadScript().catch((error) => {
          console.error('Failed to initialize analytics:', error);
        });
      }

      // Set up automatic page view tracking
      this.setupPageViewTracking();
    }
  }

  /**
   * Checks current consent status and loads/unloads script accordingly
   */
  private checkAndUpdateScriptState(): void {
    if (!this.isBrowser) {
      return;
    }

    const hasConsent = this.hasConsent();
    if (hasConsent && !this.scriptLoaded) {
      // Consent granted, load script
      this.loadScript().catch((error) => {
        console.error('Failed to load analytics script:', error);
      });
    } else if (!hasConsent && this.scriptLoaded) {
      // Consent revoked, unload script
      this.unloadScript();
    }
  }

  /**
   * Checks if user has given consent for analytics
   */
  private hasConsent(): boolean {
    return this.cookieService.areCookiesAccepted();
  }

  /**
   * Dynamically loads the Google Analytics gtag.js script
   * @returns Promise that resolves when the script is loaded
   */
  private loadScript(): Promise<void> {
    if (!this.isBrowser) {
      return Promise.reject(new Error('Analytics script can only be loaded in browser context'));
    }

    if (!this.hasConsent()) {
      return Promise.reject(new Error('User consent required to load analytics script'));
    }

    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise<void>((resolve, reject) => {
      // Check if script is already in the DOM
      if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
        this.scriptLoaded = true;
        this.initializeAnalytics();
        resolve();
        return;
      }

      // Initialize dataLayer before loading script
      window.dataLayer = window.dataLayer || [];

      // Define gtag function (standard Google Analytics implementation)
      // eslint-disable-next-line prefer-rest-params
      window.gtag = function () {
        // Convert arguments to array for dataLayer
        const args = Array.prototype.slice.call(arguments);
        window.dataLayer?.push(args);
      };

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsMeasurementId}`;
      script.onload = () => {
        this.scriptLoaded = true;
        this.initializeAnalytics();
        resolve();
      };
      script.onerror = () => {
        this.scriptLoadingPromise = null;
        reject(new Error('Failed to load Google Analytics script'));
      };
      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  /**
   * Initializes Google Analytics and Google Ads configuration
   */
  private initializeAnalytics(): void {
    if (!this.isBrowser || !window.gtag) {
      return;
    }

    // Configure Google Analytics
    window.gtag('js', new Date());
    window.gtag('config', environment.googleAnalyticsMeasurementId, {
      page_path: window.location.pathname,
    });

    // Configure Google Ads
    window.gtag('config', environment.googleAdsMeasurementId);
  }

  /**
   * Unloads the Google Analytics script and clears dataLayer
   */
  private unloadScript(): void {
    if (!this.isBrowser) {
      return;
    }

    // Remove script element
    const script = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    if (script) {
      script.remove();
    }

    // Clear dataLayer
    if (window.dataLayer) {
      window.dataLayer.length = 0;
    }

    // Remove gtag function
    delete window.gtag;

    this.scriptLoaded = false;
    this.scriptLoadingPromise = null;
  }

  /**
   * Sets up automatic page view tracking on route navigation
   */
  private setupPageViewTracking(): void {
    if (!this.isBrowser) {
      return;
    }

    // Subscribe to router navigation events for automatic page view tracking
    // No need to unsubscribe as this is a singleton service that lives for the app lifetime
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.trackPageView();
    });
  }

  /**
   * Tracks a page view in Google Analytics
   * @param pagePath Optional page path (defaults to current location)
   */
  trackPageView(pagePath?: string): void {
    if (!this.isBrowser || !this.hasConsent() || !window.gtag || !this.scriptLoaded) {
      return;
    }

    try {
      window.gtag('config', environment.googleAnalyticsMeasurementId, {
        page_path: pagePath || window.location.pathname,
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  /**
   * Tracks a conversion event for Google Ads
   * @param value Optional conversion value (defaults to environment value)
   * @param currency Optional currency (defaults to environment currency)
   */
  trackConversion(value?: number, currency?: string): void {
    if (!this.isBrowser || !this.hasConsent() || !window.gtag || !this.scriptLoaded) {
      return;
    }

    try {
      const conversionParams: ConversionEventParams = {
        send_to: `${environment.googleAdsMeasurementId}/${environment.googleAdsConversionLabel}`,
        value: value ?? environment.googleAdsConversionValue,
        currency: currency ?? environment.googleAdsConversionCurrency,
      };

      window.gtag('event', 'conversion', conversionParams);
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }
}
