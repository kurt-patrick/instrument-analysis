import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-top-tool-bar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.css']
})
export class TopToolbarComponent implements OnInit {

  message: string;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => {
      console.log('toolbar.subscribe: ' + message);
      this.message = message;
    });
  }

  newMessage() {
    this.data.changeMessage('toolbar');
  }

}
