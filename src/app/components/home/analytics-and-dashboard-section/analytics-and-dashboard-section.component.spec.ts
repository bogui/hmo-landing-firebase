import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAndDashboardSectionComponent } from './analytics-and-dashboard-section.component';

describe('AnalyticsAndDashboardSectionComponent', () => {
  let component: AnalyticsAndDashboardSectionComponent;
  let fixture: ComponentFixture<AnalyticsAndDashboardSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsAndDashboardSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsAndDashboardSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
