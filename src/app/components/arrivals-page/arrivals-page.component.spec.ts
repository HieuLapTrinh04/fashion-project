import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalsPageComponent } from './arrivals-page.component';

describe('ArrivalsPageComponent', () => {
  let component: ArrivalsPageComponent;
  let fixture: ComponentFixture<ArrivalsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrivalsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrivalsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
