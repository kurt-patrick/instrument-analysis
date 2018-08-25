import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { PriceBar } from '../../price-bar';

@Component({
  selector: 'app-daily-range',
  templateUrl: './daily-range.component.html',
  styleUrls: ['./daily-range.component.css']
})
export class DailyRangeComponent implements OnInit {

  period: 20;
  instrumentCode: string;
  private priceBars: PriceBar[];

  constructor(private data: DataService) {
    this.period = 20;
  }

  barCount() {
    if (!this.priceBars || this.priceBars.length === 0) {
      this.priceBars = [];
      this.priceBars.push(new PriceBar());
      this.priceBars.push(new PriceBar());
      this.priceBars[0].dailyRange = 0.34;
      this.priceBars[1].dailyRange = 1.7150;
    }
    return this.priceBars.length;
  }

  ngOnInit() {
    this.data.instrumentCode.subscribe(code => this.instrumentCode = code);
    this.data.instrumentPriceData.subscribe(data => this.priceBars = data);
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
    return 0;
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

}
