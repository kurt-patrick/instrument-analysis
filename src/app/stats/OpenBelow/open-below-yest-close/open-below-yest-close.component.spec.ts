import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBelowYestCloseComponent } from './open-below-yest-close.component';

describe('OpenBelowYestCloseComponent', () => {
  let component: OpenBelowYestCloseComponent;
  let fixture: ComponentFixture<OpenBelowYestCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenBelowYestCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenBelowYestCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
