import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedWorkflowsSectionComponent } from './automated-workflows-section.component';

describe('AutomatedWorkflowsSectionComponent', () => {
  let component: AutomatedWorkflowsSectionComponent;
  let fixture: ComponentFixture<AutomatedWorkflowsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomatedWorkflowsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomatedWorkflowsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
