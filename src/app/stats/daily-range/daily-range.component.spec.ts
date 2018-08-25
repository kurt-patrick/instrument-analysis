import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRangeComponent } from './daily-range.component';

describe('DailyRangeComponent', () => {
  let component: DailyRangeComponent;
  let fixture: ComponentFixture<DailyRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
