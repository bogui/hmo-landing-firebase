import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RecaptchaService } from '../../../services/recaptcha.service';
import { SignupFormSectionComponent } from './signup-form-section.component';

describe('SignupFormSectionComponent', () => {
  let component: SignupFormSectionComponent;
  let fixture: ComponentFixture<SignupFormSectionComponent>;
  let recaptchaService: jasmine.SpyObj<RecaptchaService>;

  beforeEach(async () => {
    const recaptchaSpy = jasmine.createSpyObj('RecaptchaService', ['execute']);

    await TestBed.configureTestingModule({
      imports: [SignupFormSectionComponent],
      providers: [FormBuilder, { provide: RecaptchaService, useValue: recaptchaSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupFormSectionComponent);
    component = fixture.componentInstance;
    recaptchaService = TestBed.inject(RecaptchaService) as jasmine.SpyObj<RecaptchaService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should have required validators on all fields', () => {
      expect(component.form.get('firstName')?.hasError('required')).toBe(true);
      expect(component.form.get('lastName')?.hasError('required')).toBe(true);
      expect(component.form.get('company')?.hasError('required')).toBe(true);
      expect(component.form.get('email')?.hasError('required')).toBe(true);
      expect(component.form.get('phone')?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should validate phone number format', () => {
      const phoneControl = component.form.get('phone');
      phoneControl?.setValue('123');
      expect(phoneControl?.hasError('pattern')).toBe(true);

      phoneControl?.setValue('123-456-789');
      expect(phoneControl?.hasError('pattern')).toBe(false);
    });

    it('should mark all fields as touched when form is invalid on submit', () => {
      component.onSubmit();
      expect(component.form.get('firstName')?.touched).toBe(true);
      expect(component.form.get('lastName')?.touched).toBe(true);
      expect(component.form.get('company')?.touched).toBe(true);
      expect(component.form.get('email')?.touched).toBe(true);
      expect(component.form.get('phone')?.touched).toBe(true);
    });
  });

  describe('phone number formatting', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should format phone number on input', () => {
      const phoneControl = component.form.get('phone');
      phoneControl?.setValue('898353650');
      expect(phoneControl?.value).toBe('898-353-650');
    });

    it('should remove non-digit characters', () => {
      const phoneControl = component.form.get('phone');
      phoneControl?.setValue('898-353-650');
      expect(phoneControl?.value).toBe('898-353-650');
    });

    it('should remove leading zero', () => {
      const phoneControl = component.form.get('phone');
      phoneControl?.setValue('0898353650');
      expect(phoneControl?.value).toBe('898-353-650');
    });

    it('should limit to 9 digits', () => {
      const phoneControl = component.form.get('phone');
      phoneControl?.setValue('898353650123456');
      expect(phoneControl?.value).toBe('898-353-650');
    });

    it('should handle empty input', () => {
      const phoneControl = component.form.get('phone');
      phoneControl?.setValue('');
      expect(phoneControl?.value).toBe('');
    });
  });

  describe('form submission', () => {
    beforeEach(() => {
      // Fill form with valid data
      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        company: 'Test Company',
        email: 'john@example.com',
        phone: '123-456-789',
      });
    });

    it('should call recaptcha service on valid form submission', () => {
      recaptchaService.execute.and.returnValue(of('test-token-123'));

      component.onSubmit();

      expect(recaptchaService.execute).toHaveBeenCalledWith('signup');
    });

    it('should set loading to true when submitting', () => {
      recaptchaService.execute.and.returnValue(of('test-token-123'));

      component.onSubmit();

      expect(component.loading()).toBe(true);
    });

    it('should prepare form data with country prefix and token', (done) => {
      recaptchaService.execute.and.returnValue(of('test-token-123'));

      spyOn(console, 'log');

      component.onSubmit();

      setTimeout(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Form data ready for submission:',
          jasmine.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            company: 'Test Company',
            email: 'john@example.com',
            phone: '+359 123-456-789',
            recaptchaToken: 'test-token-123',
          })
        );
        done();
      }, 0);
    });

    it('should set loading to false after successful token generation', (done) => {
      recaptchaService.execute.and.returnValue(of('test-token-123'));

      component.onSubmit();

      setTimeout(() => {
        expect(component.loading()).toBe(false);
        done();
      }, 0);
    });

    it('should handle recaptcha service error', (done) => {
      recaptchaService.execute.and.returnValue(throwError(() => new Error('reCAPTCHA failed')));

      spyOn(console, 'error');

      component.onSubmit();

      setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith(
          'reCAPTCHA token generation failed:',
          jasmine.any(Error)
        );
        expect(component.loading()).toBe(false);
        done();
      }, 0);
    });

    it('should handle null token from recaptcha', (done) => {
      recaptchaService.execute.and.returnValue(of(null as any));

      spyOn(console, 'error');

      component.onSubmit();

      setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith('reCAPTCHA token generation failed');
        expect(component.loading()).toBe(false);
        done();
      }, 0);
    });

    it('should not submit if form is invalid', () => {
      component.form.reset();
      component.onSubmit();

      expect(recaptchaService.execute).not.toHaveBeenCalled();
      expect(component.loading()).toBe(false);
    });
  });
});
