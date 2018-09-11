import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAboveYestCloseComponent } from './open-above-yest-close.component';

describe('OpenAboveYestCloseComponent', () => {
  let component: OpenAboveYestCloseComponent;
  let fixture: ComponentFixture<OpenAboveYestCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenAboveYestCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAboveYestCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
