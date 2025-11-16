import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BelowHeroSectionComponent } from './below-hero-section.component';

describe('BelowHeroSectionComponent', () => {
  let component: BelowHeroSectionComponent;
  let fixture: ComponentFixture<BelowHeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BelowHeroSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BelowHeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
