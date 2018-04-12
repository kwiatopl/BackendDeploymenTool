import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlRuleFormComponent } from './crawl-rule-form.component';

describe('CrawlRuleFormComponent', () => {
  let component: CrawlRuleFormComponent;
  let fixture: ComponentFixture<CrawlRuleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlRuleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlRuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
