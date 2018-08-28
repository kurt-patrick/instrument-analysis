import { PriceBar } from './../price-bar';
import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { DataService } from './../shared/data.service';

@Component({
  selector: 'app-bar-data-paginated',
  templateUrl: './bar-data-paginated.component.html',
  styleUrls: ['./bar-data-paginated.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarDataPaginatedComponent implements OnInit {

  page: 1;
  instrumentCode: string;
  priceBars: PriceBar[];

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
