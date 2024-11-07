import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchPatientComponent } from './match-patient.component';

describe('MatchPatientComponent', () => {
  let component: MatchPatientComponent;
  let fixture: ComponentFixture<MatchPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
