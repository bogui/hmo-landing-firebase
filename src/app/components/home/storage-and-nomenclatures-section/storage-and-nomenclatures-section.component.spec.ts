import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageAndNomenclaturesSectionComponent } from './storage-and-nomenclatures-section.component';

describe('StorageAndNomenclaturesSectionComponent', () => {
  let component: StorageAndNomenclaturesSectionComponent;
  let fixture: ComponentFixture<StorageAndNomenclaturesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageAndNomenclaturesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageAndNomenclaturesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
