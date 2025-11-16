import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ImageUtils } from '../../../utils/image.utils';

@Component({
  selector: 'app-home-problem-section',
  imports: [NgOptimizedImage],
  templateUrl: './problem-section.component.html',
  styleUrl: './problem-section.component.scss',
})
export class ProblemSectionComponent {
  // Theme-aware image path for the mess/problem illustration
  theMessImage = ImageUtils.getThemeImageSignal('the_mess');
}
