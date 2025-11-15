import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CoockieManagerComponent } from '../../components/coockie-manager/coockie-manager.component';
import { AnalyticsAndDashboardSectionComponent } from '../../components/home/analytics-and-dashboard-section/analytics-and-dashboard-section.component';
import { AutomatedWorkflowsSectionComponent } from '../../components/home/automated-workflows-section/automated-workflows-section.component';
import { ExclusiveSectionComponent } from '../../components/home/exclusive-section/exclusive-section.component';
import { FeaturesSectionComponent } from '../../components/home/features-section/features-section.component';
import { HeroSectionComponent } from '../../components/home/hero-section/hero-section.component';
import { ProblemSectionComponent } from '../../components/home/problem-section/problem-section.component';
import { SignupFormSectionComponent } from '../../components/home/signup-form-section/signup-form-section.component';
import { SolutionSectionComponent } from '../../components/home/solution-section/solution-section.component';
import { StorageAndNomenclaturesSectionComponent } from '../../components/home/storage-and-nomenclatures-section/storage-and-nomenclatures-section.component';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-home',
  imports: [
    HeroSectionComponent,
    ProblemSectionComponent,
    SolutionSectionComponent,
    FeaturesSectionComponent,
    StorageAndNomenclaturesSectionComponent,
    AutomatedWorkflowsSectionComponent,
    AnalyticsAndDashboardSectionComponent,
    ExclusiveSectionComponent,
    SignupFormSectionComponent,
    CoockieManagerComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  private readonly _cookieService = inject(CookieService);
  private readonly _platform = inject(PLATFORM_ID);

  showCookieManager = this._cookieService.showCookieManager;

  ngOnInit(): void {
    if (isPlatformBrowser(this._platform)) {
      this._cookieService.setShowCookieManager(
        !this._cookieService.areCookiesAccepted() && !this._cookieService.areCookiesRejected()
      );
    }
  }
}
