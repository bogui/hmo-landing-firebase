import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoockieManagerComponent } from './coockie-manager.component';

describe('CoockieManagerComponent', () => {
  let component: CoockieManagerComponent;
  let fixture: ComponentFixture<CoockieManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoockieManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoockieManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
