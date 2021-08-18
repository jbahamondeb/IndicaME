import { TestBed } from '@angular/core/testing';

import { GetDataIndicadorService } from './get-data-indicador.service';

describe('GetDataIndicadorService', () => {
  let service: GetDataIndicadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetDataIndicadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
