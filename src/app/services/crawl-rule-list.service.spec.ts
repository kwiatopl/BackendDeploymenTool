import { TestBed, inject } from '@angular/core/testing';

import { CrawlRuleListService } from './crawl-rule-list.service';

describe('CrawlRuleListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrawlRuleListService]
    });
  });

  it('should be created', inject([CrawlRuleListService], (service: CrawlRuleListService) => {
    expect(service).toBeTruthy();
  }));
});
