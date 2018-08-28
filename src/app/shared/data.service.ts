import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Injectable, Output } from '@angular/core';
import { PriceBar } from './../price-bar';


@Injectable({ providedIn: 'root' })
export class DataService {

  priceBars: PriceBar[];

  instrumentCodeService = new BehaviorSubject<string>('');
  instrumentCode = this.instrumentCodeService.asObservable();

  constructor() {}

  changeInstrument(message: string) {
    this.instrumentCodeService.next(message);
    this.priceBars = null;
  }

}
