import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RecaptchaService } from '../../../services/recaptcha.service';

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
  private readonly _formBuilder = inject(FormBuilder);

  loading = signal(false);

  form = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{3}$/)]],
  });

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
        })
      )
      .subscribe({
        next: (token) => {
          if (token) {
            const phoneValue = this.form.value.phone || '';
            // Prepare form data with phone number including country prefix
            const formData = {
              ...this.form.value,
              phone: `+359 ${phoneValue}`, // Add country prefix
              recaptchaToken: token, // Include token for server-side validation
            };

            console.log('Form data ready for submission:', formData);

            // TODO: Send formData to your backend API endpoint
            // The backend should verify the recaptchaToken by making a POST request to:
            // https://www.google.com/recaptcha/api/siteverify
            // with parameters: secret (your secret key), response (the token)
            // Example:
            // this.http.post('/api/signup', formData).subscribe({
            //   next: (response) => {
            //     console.log('Form submitted successfully:', response);
            //   },
            //   error: (error) => {
            //     console.error('Form submission failed:', error);
            //   }
            // });
          } else {
            console.error('reCAPTCHA token generation failed');
            // You might want to show an error message to the user here
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
