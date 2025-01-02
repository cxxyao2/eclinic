import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPopupItemComponent } from './search-popup-item.component';

describe('SearchPopupItemComponent', () => {
  let component: SearchPopupItemComponent;
  let fixture: ComponentFixture<SearchPopupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPopupItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPopupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
