import { ViewportScroller } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly _scroller = inject(ViewportScroller);

  scrollToAnchor(anchor: string) {
    this._scroller.scrollToAnchor(anchor, { behavior: 'smooth' });
  }

  scrollToTop() {
    this._scroller.scrollToPosition([0, 0], { behavior: 'smooth' });
  }
}
