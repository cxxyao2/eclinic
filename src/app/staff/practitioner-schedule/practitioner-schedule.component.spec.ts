import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerScheduleComponent } from './practitioner-schedule.component';

describe('PractitionerScheduleComponent', () => {
  let component: PractitionerScheduleComponent;
  let fixture: ComponentFixture<PractitionerScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PractitionerScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PractitionerScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
