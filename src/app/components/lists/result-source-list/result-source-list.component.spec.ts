import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSourceListComponent } from './result-source-list.component';

describe('ResultSourceListComponent', () => {
  let component: ResultSourceListComponent;
  let fixture: ComponentFixture<ResultSourceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSourceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
