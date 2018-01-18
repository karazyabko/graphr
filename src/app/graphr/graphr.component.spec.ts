import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphrComponent } from './graphr.component';

describe('GraphrComponent', () => {
  let component: GraphrComponent;
  let fixture: ComponentFixture<GraphrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
