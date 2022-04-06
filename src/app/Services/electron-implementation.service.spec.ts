import { TestBed } from '@angular/core/testing';

import { ElectronImplementationService } from './electron-implementation.service';

describe('ElectronImplementationService', () => {
  let service: ElectronImplementationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronImplementationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
