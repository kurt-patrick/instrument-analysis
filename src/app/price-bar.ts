import { IPriceBar } from './iprice-bar';

export class PriceBar implements IPriceBar {
  private loaded = false;
  code: string;
  date: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
  dailyRange: number;
  index: number;

  constructor() {}

  populateFromCsvRow(row: string): boolean {

    const arr = row.split(',');
    if (arr == null || arr === undefined || arr.length < 7) {
      return false;
    }

    this.code = arr[0];
    this.date = arr[1];
    this.openPrice = Number(arr[2]);
    this.highPrice = Number(arr[3]);
    this.lowPrice = Number(arr[4]);
    this.closePrice = Number(arr[5]);
    this.volume = Number(arr[6]);
    this.dailyRange = this.highPrice - this.lowPrice;
    this.loaded = true;

    // success, we have a price bar
    return true;

  }

}
