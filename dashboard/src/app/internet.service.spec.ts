import { TestBed } from '@angular/core/testing';

import { InternetService } from './internet.service';

describe('InternetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InternetService = TestBed.get(InternetService);
    expect(service).toBeTruthy();
  });
});
