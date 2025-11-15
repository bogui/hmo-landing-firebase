import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ImageUtils } from '../../../utils/image.utils';

@Component({
  selector: 'app-home-hero-section',
  imports: [NgOptimizedImage],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {
  // Theme-aware image path for dashboard
  dashboardImage = ImageUtils.getThemeImageSignal('dashboard');
}
