import { TestBed, inject } from '@angular/core/testing';

import { ResultSourceListService } from './result-source-list.service';

describe('ResultSourceListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResultSourceListService]
    });
  });

  it('should be created', inject([ResultSourceListService], (service: ResultSourceListService) => {
    expect(service).toBeTruthy();
  }));
});
