import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonQueriesComponent } from './common-queries.component';

describe('CommonQueriesComponent', () => {
  let component: CommonQueriesComponent;
  let fixture: ComponentFixture<CommonQueriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonQueriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
