import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MriImagesComponent } from './mri-images.component';

describe('MriImagesComponent', () => {
  let component: MriImagesComponent;
  let fixture: ComponentFixture<MriImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MriImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MriImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
