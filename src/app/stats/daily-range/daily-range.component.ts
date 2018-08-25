import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { PriceBar } from '../../price-bar';

@Component({
  selector: 'app-daily-range',
  templateUrl: './daily-range.component.html',
  styleUrls: ['./daily-range.component.css']
})
export class DailyRangeComponent implements OnInit {

  instrumentCode: string;
  priceBars: PriceBar[];

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.instrumentCode.subscribe(code => this.instrumentCode = code);
  }

  minPriceRange(days: number) {

  }

}
