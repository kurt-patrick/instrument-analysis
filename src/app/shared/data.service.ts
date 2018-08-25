import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Injectable, Output } from '@angular/core';
import { PriceBar } from './../price-bar';


@Injectable({ providedIn: 'root' })
export class DataService {

  instrumentCodeService = new BehaviorSubject<string>('');
  instrumentPriceDataService = new BehaviorSubject<PriceBar[]>(null);

  instrumentCode = this.instrumentCodeService.asObservable();
  instrumentPriceData = this.instrumentPriceDataService.asObservable();

  constructor() {}

  changeInstrument(message: string) {
    this.instrumentCodeService.next(message);
  }

  changeInstrumentPriceData(message: PriceBar[]) {
    this.instrumentPriceDataService.next(message);
  }

}
