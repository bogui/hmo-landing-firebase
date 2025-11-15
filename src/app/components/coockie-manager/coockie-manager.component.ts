import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from '../../services/cookie.service';
import { PrivacyPolicyModalComponent } from '../privacy-policy-modal/privacy-policy-modal.component';

@Component({
  selector: 'app-coockie-manager',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './coockie-manager.component.html',
  styleUrl: './coockie-manager.component.scss',
})
export class CoockieManagerComponent {
  private readonly _dialog = inject(MatDialog);
  private readonly _cookieService = inject(CookieService);

  openPrivacyPolicyModal() {
    this._dialog.open(PrivacyPolicyModalComponent, {
      width: '800px',
      height: '800px',
      maxHeight: '90vh',
      maxWidth: '90vw',
      panelClass: 'full-screen-modal',
    });
  }

  acceptAllCookies() {
    this._cookieService.setCookiesAccepted();
  }

  rejectAllCookies() {
    this._cookieService.setCookiesRejected();
  }
}
