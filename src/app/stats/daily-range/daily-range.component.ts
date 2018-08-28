import { PriceBar } from './../../price-bar';
import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-daily-range',
  templateUrl: './daily-range.component.html',
  styleUrls: ['./daily-range.component.css']
})
export class DailyRangeComponent implements OnInit {

  @Input()
  period: number;
  instrumentCode: string;
  private priceBars: PriceBar[];
  private dailyRangeValues: number[];

  constructor(private data: DataService) {
    this.period = 20;
  }

  barCount() {
    if (!this.priceBars || this.priceBars.length === 0) {
      return 0;
    }
    return this.priceBars.length;
  }

  ngOnInit() {
    this.data.instrumentCode.subscribe(newValue => {
      this.instrumentCode = newValue;
      this.priceBars = this.data.priceBars;
    });
  }

  avgPriceRange() {
    let rv = 0;
    const bars = this.getBarsForPeriod();
    if (bars) {
      rv = bars.reduce((dailyRange, priceBar) => dailyRange + priceBar.dailyRange, 0);
      if (rv > 0) {
        rv /= bars.length;
      }
    }
    return rv;
  }

  minPriceRange() {
    let rv = 0;
    const bars = this.getBarsForPeriod();
    if (bars) {
      rv = bars.reduce((min, b) => Math.min(min, b.dailyRange), bars[0].dailyRange);
    }
    return rv;
  }

  maxPriceRange() {
    let rv = 0;
    const bars = this.getBarsForPeriod();
    if (bars) {
      rv = bars.reduce((max, b) => Math.max(max, b.dailyRange), bars[0].dailyRange);
    }
    return rv;
  }

  medianPriceRange() {
    // https://www.jstips.co/en/javascript/array-average-and-median/
    console.log('medianPriceRange()');
    const bars = this.getBarsForPeriod();
    const values = this.getDailyRangeValues(bars);
    console.log('values: ' + values);

    values.sort((a, b) => a - b);

    console.log('values: ' + values);
    const lowMiddle = Math.floor((values.length - 1) / 2);
    const highMiddle = Math.ceil((values.length - 1) / 2);
    const median = (values[lowMiddle] + values[highMiddle]) / 2;
    return median;

    /*
    if (values) {
      values.sort();
      if (values.length === 1) {
        return values[0];
      }
      console.log(values);
      if (values.length % 2 === 0) {
        const lowMiddle = Math.floor((values.length - 1) / 2);
        const highMiddle = Math.ceil((values.length - 1) / 2);
        const median = (values[lowMiddle] + values[highMiddle]) / 2;
        return median;
      }
      return ((values[values.length / 2]) + 0.5);

    }
    */
    // return 0;
  }

  eightyPercentilePriceRange() {
    const bars = this.getBarsForPeriod();
    let values = this.getDailyRangeValues(bars);

    values = values.sort((a, b) => a - b);

    const index = Math.floor(values.length * 0.80);
    return values[index];
  }

  private getBarsForPeriod(): PriceBar[] {
    if (!this.priceBars || this.priceBars.length === 0) {
      return null;
    }
    if (this.priceBars.length < this.period) {
      return this.priceBars;
    }
    return this.priceBars.slice(0, this.period - 1);
  }

  private getDailyRangeValues(bars: PriceBar[]): number[] {
    if (!bars || bars.length === 0) {
      return null;
    }
    let index: number;
    const list: number[] = new Array<number>();
    for (index = 0; index < bars.length; index++) {
      list.push(bars[index].dailyRange);
    }
    return list;
  }

  private onInstrumentCodeChange(code: string): void {
    this.instrumentCode = code;
  }

  private onInstrumentPriceDataChange(data: PriceBar[]): void {
    this.priceBars = data;
  }

}
