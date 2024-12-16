import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInWaitingListComponent } from './check-in-waiting-list.component';

describe('CheckInWaitingListComponent', () => {
  let component: CheckInWaitingListComponent;
  let fixture: ComponentFixture<CheckInWaitingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInWaitingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInWaitingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
