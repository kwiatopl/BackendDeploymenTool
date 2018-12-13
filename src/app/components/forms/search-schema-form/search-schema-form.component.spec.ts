import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSchemaFormComponent } from './search-schema-form.component';

describe('SearchSchemaFormComponent', () => {
  let component: SearchSchemaFormComponent;
  let fixture: ComponentFixture<SearchSchemaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSchemaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSchemaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
