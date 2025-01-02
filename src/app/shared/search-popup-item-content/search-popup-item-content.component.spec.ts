import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPopupItemContentComponent } from './search-popup-item-content.component';

describe('SearchPopupItemContentComponent', () => {
  let component: SearchPopupItemContentComponent;
  let fixture: ComponentFixture<SearchPopupItemContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPopupItemContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPopupItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
