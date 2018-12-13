import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlRuleListComponent } from './crawl-rule-list.component';

describe('CrawlRuleListComponent', () => {
  let component: CrawlRuleListComponent;
  let fixture: ComponentFixture<CrawlRuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlRuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlRuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
