import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusiveSectionComponent } from './exclusive-section.component';

describe('ExclusiveSectionComponent', () => {
  let component: ExclusiveSectionComponent;
  let fixture: ComponentFixture<ExclusiveSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExclusiveSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExclusiveSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
