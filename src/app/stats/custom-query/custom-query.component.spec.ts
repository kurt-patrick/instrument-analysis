import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQueryComponent } from './custom-query.component';

describe('CustomQueryComponent', () => {
  let component: CustomQueryComponent;
  let fixture: ComponentFixture<CustomQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
