import { PriceBar } from './../../price-bar';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-daily-range-container',
  templateUrl: './daily-range-container.component.html',
  styleUrls: ['./daily-range-container.component.css']
})
export class DailyRangeContainerComponent implements OnInit {

  instrumentCode: string;
  private priceBars: PriceBar[];

  constructor(private data: DataService) {
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

}
