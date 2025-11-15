import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
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
import { SupabaseService } from '../../services/supabase.service';

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
  private readonly _supabaseService = inject(SupabaseService);

  showCookieManager = this._cookieService.showCookieManager;
  registerdUsersCount = signal<number>(0);


  ngOnInit(): void {
    if (isPlatformBrowser(this._platform)) {
      this._cookieService.setShowCookieManager(
        !this._cookieService.areCookiesAccepted() && !this._cookieService.areCookiesRejected()
      );

      this._supabaseService.client
        .from('signups')
        .select('*', { count: 'exact' })
        .then(({ count, error }) => {
          if (error) {
            console.error('Error fetching signups:', error);
            return;
          }
          this.registerdUsersCount.set(count || 0);
        });
    }
  }

  onRegistered(): void {
    this._supabaseService.client
      .from('signups')
      .select('*', { count: 'exact' })
      .then(({ count, error }) => {
        if (error) {
          console.error('Error fetching signups:', error);
          return;
        }
        this.registerdUsersCount.set(count || 0);
      });
  }
}
