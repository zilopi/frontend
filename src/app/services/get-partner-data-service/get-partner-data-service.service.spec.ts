import { TestBed } from '@angular/core/testing';

import { GetPartnerDataServiceService } from './get-partner-data-service.service';

describe('GetPartnerDataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetPartnerDataServiceService = TestBed.get(GetPartnerDataServiceService);
    expect(service).toBeTruthy();
  });
});
