import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientBedAssignComponent } from './inpatient-bed-assign.component';

describe('InpatientBedAssignComponent', () => {
  let component: InpatientBedAssignComponent;
  let fixture: ComponentFixture<InpatientBedAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InpatientBedAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InpatientBedAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
