import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarDataPaginatedComponent } from './bar-data-paginated.component';

describe('BarDataPaginatedComponent', () => {
  let component: BarDataPaginatedComponent;
  let fixture: ComponentFixture<BarDataPaginatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarDataPaginatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarDataPaginatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
