import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from '../../services/cookie.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-footer-section',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss',
})
export class FooterSectionComponent {
  private readonly _cookieService = inject(CookieService);
  private readonly _navigationService = inject(NavigationService);

  scrollToTop() {
    this._navigationService.scrollToTop();
  }

  onShowCookieManager() {
    this._cookieService.setShowCookieManager(true);
  }
}
