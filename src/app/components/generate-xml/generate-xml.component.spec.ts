import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateXmlComponent } from './generate-xml.component';

describe('GenerateXmlComponent', () => {
  let component: GenerateXmlComponent;
  let fixture: ComponentFixture<GenerateXmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateXmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateXmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
