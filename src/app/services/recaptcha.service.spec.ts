import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { RecaptchaService } from './recaptcha.service';

describe('RecaptchaService', () => {
  let service: RecaptchaService;
  let mockGrecaptcha: any;
  let mockScript: HTMLScriptElement;

  beforeEach(() => {
    // Mock window.grecaptcha
    mockGrecaptcha = {
      ready: jasmine.createSpy('ready').and.callFake((callback: () => void) => {
        callback();
      }),
      execute: jasmine.createSpy('execute').and.returnValue(Promise.resolve('mock-token-123')),
    };

    (window as any).grecaptcha = mockGrecaptcha;

    // Mock document methods
    mockScript = document.createElement('script');
    spyOn(document, 'createElement').and.returnValue(mockScript);
    spyOn(document.head, 'appendChild').and.callFake((node) => node);
    spyOn(document, 'querySelector').and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(RecaptchaService);
  });

  afterEach(() => {
    delete (window as any).grecaptcha;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should generate a token for a valid action', (done) => {
      // Simulate script loading
      setTimeout(() => {
        if (mockScript.onload) {
          mockScript.onload(new Event('load'));
        }
      }, 0);

      service.execute('signup').subscribe({
        next: (token) => {
          expect(token).toBe('mock-token-123');
          expect(mockGrecaptcha.execute).toHaveBeenCalledWith(environment.recaptchaSiteKey, {
            action: 'signup',
          });
          done();
        },
        error: done.fail,
      });
    });

    it('should return error if action is empty', (done) => {
      service.execute('').subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (error) => {
          expect(error.message).toBe('Action parameter is required');
          done();
        },
      });
    });

    it('should handle script loading error', (done) => {
      spyOn(document, 'createElement').and.returnValue(mockScript);
      setTimeout(() => {
        if (mockScript.onerror) {
          mockScript.onerror(new ErrorEvent('error'));
        }
      }, 0);

      service.execute('signup').subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (error) => {
          expect(error.message).toContain('Failed to load reCAPTCHA script');
          done();
        },
      });
    });

    it('should handle grecaptcha.execute error', (done) => {
      mockGrecaptcha.execute.and.returnValue(Promise.reject(new Error('Execution failed')));

      setTimeout(() => {
        if (mockScript.onload) {
          mockScript.onload(new Event('load'));
        }
      }, 0);

      service.execute('signup').subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (error) => {
          expect(error.message).toBe('Execution failed');
          done();
        },
      });
    });

    it('should reuse script if already loaded', (done) => {
      // First call to load script
      setTimeout(() => {
        if (mockScript.onload) {
          mockScript.onload(new Event('load'));
        }
      }, 0);

      service.execute('signup').subscribe({
        next: () => {
          // Second call should reuse the loaded script
          service.execute('login').subscribe({
            next: (token) => {
              expect(token).toBe('mock-token-123');
              expect(mockGrecaptcha.execute).toHaveBeenCalledTimes(2);
              done();
            },
            error: done.fail,
          });
        },
        error: done.fail,
      });
    });

    it('should detect script already in DOM', (done) => {
      const existingScript = document.createElement('script');
      existingScript.src = 'https://www.google.com/recaptcha/api.js?render=test';
      spyOn(document, 'querySelector').and.returnValue(existingScript);

      service.execute('signup').subscribe({
        next: (token) => {
          expect(token).toBe('mock-token-123');
          expect(document.createElement).not.toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('server-side execution', () => {
    it('should return error when executed on server-side', (done) => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      const serverService = TestBed.inject(RecaptchaService);

      serverService.execute('signup').subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (error) => {
          expect(error.message).toContain('browser context');
          done();
        },
      });
    });
  });
});
