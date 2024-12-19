import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulationFormMedicComponent } from './consulation-form-medic.component';

describe('ConsulationFormMedicComponent', () => {
  let component: ConsulationFormMedicComponent;
  let fixture: ComponentFixture<ConsulationFormMedicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsulationFormMedicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsulationFormMedicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
