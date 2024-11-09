import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientAdmitComponent } from './inpatient-admit.component';

describe('InpatientAdmitComponent', () => {
  let component: InpatientAdmitComponent;
  let fixture: ComponentFixture<InpatientAdmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InpatientAdmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InpatientAdmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
