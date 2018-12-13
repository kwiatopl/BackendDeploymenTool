import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSchemaListComponent } from './search-schema-list.component';

describe('SearchSchemaListComponent', () => {
  let component: SearchSchemaListComponent;
  let fixture: ComponentFixture<SearchSchemaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSchemaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSchemaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
