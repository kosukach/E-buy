import { TestBed } from '@angular/core/testing';

import { LocalImageService } from './local-image.service';

describe('LocalImageService', () => {
  let service: LocalImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
