import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNumberComponent } from './case-number.component';

describe('CaseNumberComponent', () => {
  let component: CaseNumberComponent;
  let fixture: ComponentFixture<CaseNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
