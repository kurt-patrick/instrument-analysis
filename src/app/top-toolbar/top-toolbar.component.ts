import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-top-tool-bar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.css']
})
export class TopToolbarComponent implements OnInit {

  instrumentCode: string;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.instrumentCode.subscribe(code => {
      this.instrumentCode = code;
    });
  }

  newMessage() {
    this.data.changeInstrument('toolbar');
  }

}
