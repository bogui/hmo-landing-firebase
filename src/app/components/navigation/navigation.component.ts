import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, isPlatformBrowser, NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { map, shareReplay, throttleTime } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import { FooterSectionComponent } from '../footer-section/footer-section.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  imports: [
    NgClass,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    FooterSectionComponent,
    RouterLinkActive,
  ],
})
export class NavigationComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private readonly _platform = inject(PLATFORM_ID);
  private readonly _navigationService = inject(NavigationService);
  private scrollSubscription?: Subscription;

  scrollPosition = signal<number>(0);
  isScrolled = signal<boolean>(false);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  ngOnInit(): void {
    if (isPlatformBrowser(this._platform)) {
      // Initialize scroll position
      this.scrollPosition.set(window.pageYOffset || window.scrollY || 0);
      this.updateScrollState();

      // Subscribe to scroll events with throttling for performance
      this.scrollSubscription = fromEvent(window, 'scroll', { passive: true })
        .pipe(throttleTime(10))
        .subscribe(() => {
          const scrollY = window.pageYOffset || window.scrollY || 0;

          this.scrollPosition.set(scrollY);
          this.updateScrollState();
        });
    }
  }

  ngOnDestroy(): void {
    this.scrollSubscription?.unsubscribe();
  }

  private updateScrollState(): void {
    // Update isScrolled based on scroll position - greater than screen height minus 50px
    if (isPlatformBrowser(this._platform)) {
      const threshold = window.innerHeight / 2;
      this.isScrolled.set(this.scrollPosition() > threshold);
    }
  }

  // Method to get toolbar classes based on scroll position
  getToolbarClasses(): string {
    if (this.isScrolled()) {
      return 'scrolled fixed top-0 left-0 right-0';
    } else {
      return 'top absolute';
    }
  }

  scroll(target: string) {
    this._navigationService.scrollToAnchor(target);
  }
}
