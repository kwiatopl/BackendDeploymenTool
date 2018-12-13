import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSourceFormComponent } from './result-source-form.component';

describe('ResultSourceFormComponent', () => {
  let component: ResultSourceFormComponent;
  let fixture: ComponentFixture<ResultSourceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSourceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
