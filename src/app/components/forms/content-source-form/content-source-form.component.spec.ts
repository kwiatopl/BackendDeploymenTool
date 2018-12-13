import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSourceFormComponent } from './content-source-form.component';

describe('ContentSourceFormComponent', () => {
  let component: ContentSourceFormComponent;
  let fixture: ComponentFixture<ContentSourceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentSourceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
