import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ImageUtils } from '../../../utils/image.utils';

@Component({
  selector: 'app-home-solution-section',
  imports: [NgOptimizedImage],
  templateUrl: './solution-section.component.html',
  styleUrl: './solution-section.component.scss',
})
export class SolutionSectionComponent {
  // Theme-aware image path for dashboard
  dashboardImage = ImageUtils.getThemeImageSignal('dashboard');
}
