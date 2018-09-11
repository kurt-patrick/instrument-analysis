import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAboveYestHighComponent } from './open-above-yest-high.component';

describe('OpenAboveYestHighComponent', () => {
  let component: OpenAboveYestHighComponent;
  let fixture: ComponentFixture<OpenAboveYestHighComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenAboveYestHighComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAboveYestHighComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
