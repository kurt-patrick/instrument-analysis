import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRangeContainerComponent } from './daily-range-container.component';

describe('DailyRangeContainerComponent', () => {
  let component: DailyRangeContainerComponent;
  let fixture: ComponentFixture<DailyRangeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyRangeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRangeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
