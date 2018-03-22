import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSourceListComponent } from './content-source-list.component';

describe('ItemsListComponent', () => {
  let component: ContentSourceListComponent;
  let fixture: ComponentFixture<ContentSourceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentSourceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
