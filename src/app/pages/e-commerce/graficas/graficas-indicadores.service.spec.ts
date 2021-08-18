import { TestBed } from '@angular/core/testing';

import { GraficasIndicadoresService } from './graficas-indicadores.service';

describe('GraficasIndicadoresService', () => {
  let service: GraficasIndicadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficasIndicadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
