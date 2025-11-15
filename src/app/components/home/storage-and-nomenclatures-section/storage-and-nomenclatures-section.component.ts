import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ImageUtils } from '../../../utils/image.utils';

@Component({
  selector: 'app-home-storage-and-nomenclatures-section',
  imports: [NgOptimizedImage],
  templateUrl: './storage-and-nomenclatures-section.component.html',
  styleUrl: './storage-and-nomenclatures-section.component.scss',
})
export class StorageAndNomenclaturesSectionComponent {
  // Theme-aware image path for inventory
  inventoryImage = ImageUtils.getThemeImageSignal('inventory');
}
