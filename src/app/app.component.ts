import { Component, OnInit } from '@angular/core';
import { MockInstrumentNames } from './mock-instruments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  instrumentNames = MockInstrumentNames;
  selectedInstrument: string;

  constructor() {}

  ngOnInit(): void {
  }

  onSelectInstrument(instrumentName: string): void {
    this.selectedInstrument = instrumentName;
  }
}
