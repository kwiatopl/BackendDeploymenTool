import { TestBed, inject } from '@angular/core/testing';

import { ContentSourceListService } from './content-source-list.service';

describe('ItemListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentSourceListService]
    });
  });

  it('should be created', inject([ContentSourceListService], (service: ContentSourceListService) => {
    expect(service).toBeTruthy();
  }));
});
