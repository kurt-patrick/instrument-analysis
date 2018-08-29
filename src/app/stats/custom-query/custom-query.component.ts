import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-query',
  templateUrl: './custom-query.component.html',
  styleUrls: ['./custom-query.component.css']
})
export class CustomQueryComponent implements OnInit {

  tradeCount: number;
  trueCount: number;
  falseCount: number;

  constructor() { }

  ngOnInit() {
  }

  calculate(): void {
    this.tradeCount = 0;
    this.trueCount = 0;
    this.falseCount = 0;
  }
}
