import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AnalyticsService } from '../../../services/analytics.service';
import { RecaptchaService } from '../../../services/recaptcha.service';
import { SupabaseService } from '../../../services/supabase.service';
import { TablesInsert } from '../../../types/supabase.types';

@Component({
  selector: 'app-home-signup-form-section',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup-form-section.component.html',
  styleUrl: './signup-form-section.component.scss',
})
export class SignupFormSectionComponent implements OnInit {
  private readonly _recaptchaService = inject(RecaptchaService);
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _supabaseService = inject(SupabaseService);

  loading = signal(false);

  submitted = signal<boolean>(false);

  form = this._formBuilder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{3}$/)]],
  });

  registered = output<void>();

  ngOnInit(): void {
    // Format phone number on value changes
    this.form.get('phone')?.valueChanges.subscribe((value) => {
      if (value && typeof value === 'string') {
        const formatted = this.formatPhoneNumber(value);
        const phoneControl = this.form.get('phone');
        if (phoneControl && formatted !== value) {
          phoneControl.setValue(formatted, { emitEvent: false });
        }
      }
    });
  }

  private formatPhoneNumber(value: string): string {
    // Remove all non-digit characters
    let digits = value.replace(/\D/g, '');

    // Remove leading 0 if present
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }

    // Limit to 9 digits (Bulgarian phone number format)
    digits = digits.substring(0, 9);

    // Format in groups of 3 with hyphens
    if (digits.length === 0) {
      return '';
    }

    const groups: string[] = [];
    for (let i = 0; i < digits.length; i += 3) {
      groups.push(digits.substring(i, i + 3));
    }

    return groups.join('-');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    // Get reCAPTCHA token and prepare form data for submission
    this._recaptchaService
      .execute('signup')
      .pipe(
        catchError((error) => {
          console.error('reCAPTCHA token generation failed:', error);
          // You might want to show an error message to the user here
          return of(null);
        }),
        switchMap((token) => {
          if (!token) {
            return throwError(() => new Error('reCAPTCHA token generation failed'));
          }

          const phoneValue = this.form.value.phone || '';
          // Prepare form data with phone number including country prefix
          const formData: TablesInsert<'signups'> = {
            ...this.form.value,
            phone: `+359 ${phoneValue}`, // Add country prefix
          } as TablesInsert<'signups'>;

          // Call orchestrator edge function
          return this._supabaseService.client.functions.invoke('process-signup', {
            body: {
              action: 'signup',
              recaptchaToken: token,
              payload: {
                first_name: formData.first_name!,
                last_name: formData.last_name!,
                company: formData.company!,
                email: formData.email!,
                phone: formData.phone!,
              },
            },
          });
        })
      )
      .subscribe({
        next: ({ data, error }) => {
          if (error) {
            console.error('Signup processing failed:', error);
            this.submitted.set(false);
            this.form.setErrors({ serverError: true });
            return;
          }
          const status = data?.status as
            | 'success'
            | 'already_registered'
            | 'recaptcha_failed'
            | 'server_error'
            | undefined;
          if (status === 'success') {
            // Track conversion for Google Ads campaign
            this._analyticsService.trackConversion(
              environment.googleAdsConversionValue,
              environment.googleAdsConversionCurrency
            );
            this.submitted.set(true);
            this.registered.emit();
          } else if (status === 'already_registered') {
            console.log('User already registered; we will contact shortly.');
            this.form.setErrors({ alreadyRegistered: true });
          } else if (status === 'recaptcha_failed') {
            this.form.setErrors({ recaptchaFailed: true });
            console.log('reCAPTCHA failed. Submission disabled.');
          } else {
            this.form.setErrors({ serverError: true });
            console.log('Server error. Please try again later.');
          }
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          // You might want to show an error message to the user here
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }
}
