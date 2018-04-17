import { TestBed, inject } from '@angular/core/testing';

import { MappingListService } from './mapping-list.service';

describe('MappingListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MappingListService]
    });
  });

  it('should be created', inject([MappingListService], (service: MappingListService) => {
    expect(service).toBeTruthy();
  }));
});
