import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-home-hero-section',
  imports: [MatButtonModule, MatIconModule, NgOptimizedImage],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {
  private readonly _navigation = inject(NavigationService);
  registerdUsersCount = input<number>(0);
  allowedUsersCount = 100;
  spotsLeft = computed(() =>
    Math.max(0, this.allowedUsersCount - (this.registerdUsersCount() || 0))
  );

  scrollToSignup(): void {
    this._navigation.scrollToAnchor('signup-form');
  }
}
