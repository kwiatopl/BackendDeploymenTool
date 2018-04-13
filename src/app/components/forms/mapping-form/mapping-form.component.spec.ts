import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingFormComponent } from './mapping-form.component';

describe('MappingFormComponent', () => {
  let component: MappingFormComponent;
  let fixture: ComponentFixture<MappingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
