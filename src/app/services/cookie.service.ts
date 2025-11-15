import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private readonly _showCookieManager = signal<boolean>(true);
  showCookieManager = this._showCookieManager.asReadonly();

  public setShowCookieManager(value: boolean) {
    this._showCookieManager.set(value);
  }

  public areCookiesAccepted(): boolean {
    return this.getCookie('cookiesAccepted') !== null;
  }

  public areCookiesRejected(): boolean {
    return this.getCookie('cookiesRejected') !== null;
  }

  public setCookiesAccepted() {
    this.removeCookie('cookiesRejected');
    this.setCookie('cookiesAccepted', new Date().toISOString());
    this._showCookieManager.set(false);
  }

  public setCookiesRejected() {
    this.removeCookie('cookiesAccepted');
    this.setCookie('cookiesRejected', new Date().toISOString());
    this._showCookieManager.set(false);
  }

  public clearCookiesAccepted() {
    this.removeCookie('cookiesAccepted');
  }

  private getCookie(key: string) {
    if (!key) {
      return null;
    }

    return localStorage.getItem(key);
  }

  private removeCookie(key: string) {
    if (!key) {
      return;
    }

    localStorage.removeItem(key);
  }

  private setCookie(key: string, value: string) {
    if (!key || !value) {
      return;
    }

    localStorage.setItem(key, value);
  }
}
