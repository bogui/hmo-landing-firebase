import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ImageUtils } from '../../../utils/image.utils';

@Component({
  selector: 'app-home-below-hero-section',
  imports: [NgOptimizedImage],
  templateUrl: './below-hero-section.component.html',
  styleUrl: './below-hero-section.component.scss',
})
export class BelowHeroSectionComponent {
  // Theme-aware image path for dashboard
  dashboardImage = ImageUtils.getThemeImageSignal('dashboard');

  registerdUsersCount = input<number>(0);

  allowedUsersCount = 100;

  actualRegisterdUsersCount = computed(() => this.allowedUsersCount - this.registerdUsersCount());
}
