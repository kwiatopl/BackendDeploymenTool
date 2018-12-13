import { TestBed, inject } from '@angular/core/testing';

import { SearchSchemaListService } from './search-schema-list.service';

describe('SearchSchemaListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchSchemaListService]
    });
  });

  it('should be created', inject([SearchSchemaListService], (service: SearchSchemaListService) => {
    expect(service).toBeTruthy();
  }));
});
