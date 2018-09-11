import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBelowYestLowComponent } from './open-below-yest-low.component';

describe('OpenBelowYestLowComponent', () => {
  let component: OpenBelowYestLowComponent;
  let fixture: ComponentFixture<OpenBelowYestLowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenBelowYestLowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenBelowYestLowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
