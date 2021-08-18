import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChangesService {
  public configObservable = new Subject<boolean>()
  
  constructor() { }


  emitConfig(val) {
    this.configObservable.next(val);
  }



}
