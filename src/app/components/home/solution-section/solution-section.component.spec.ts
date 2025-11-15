import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionSectionComponent } from './solution-section.component';

describe('SolutionSectionComponent', () => {
  let component: SolutionSectionComponent;
  let fixture: ComponentFixture<SolutionSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
