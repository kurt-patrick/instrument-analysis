import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { PriceBar } from '../price-bar';

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.css']
})
export class FileImportComponent implements OnInit {

  instrumentCode: string;
  private progress: HTMLDivElement;
  priceBars: PriceBar[];

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.instrumentCode = message);
    this.progress = document.querySelector('.percent');
  }

  handleFileSelect(evt): void {

    // alert('evt.value: ' + evt.value);         // This is the filepath
    // alert('evt.files: ' + evt.files);         // This is the list of selected files
    // alert('evt.files[0]: ' + evt.files[0]);   // The first file object in the list

    // Reset progress indicator on new file selection.
    // progress.style.width = '0%';
    // this.progress.textContent = '0%';

    const reader = new FileReader();
    reader.onerror = this.errorHandler;
    reader.onabort = function(e) {
      alert('File read cancelled');
    };
    reader.onloadstart = (e) => {
      // document.getElementById('progress_bar').className = 'loading';
    };
    reader.onload = function(e) {
      // Ensure that the progress bar displays 100% at the end.
      // progress.style.width = '100%';
      // this.progress.textContent = '100%';
      // setTimeout('document.getElementById(\'progress_bar\').className=\'\';', 2000);
      // document.getElementById('progress_bar').textContent = 'Loaded ...';
    };

    // note: the function call has to be defined as '(e) =>' otherwise we cannot access this.priceBars
    // using function (e) {} will not work
    reader.onloadend = (e) => {
      console.log('Finished reading file in (reader.onloadend)');
      console.log('File contents:');
      // console.log(reader.result);

      // Parse the bar data into objects
      const arr = reader.result.split('\n');
      let arrIndex = 0;
      this.priceBars = [];
      let priceBar: PriceBar;

      console.log('arr.length: ' + arr.length);

      // start from 1 to skip headers
      for (arrIndex = 1; arrIndex < arr.length; arrIndex++) {
        priceBar = new PriceBar();
        if (priceBar.populateFromCsvRow(arr[arrIndex])) {
          this.priceBars.push(priceBar);
        }
      }

      if (this.priceBars && this.priceBars.length > 0) {
        this.instrumentCode = this.priceBars[0].code;
        this.data.changeMessage(this.instrumentCode);
      }

      console.log('this.priceBars.length: ' + this.priceBars.length);

    };

    // Read in the image file as a binary string.
    reader.readAsBinaryString(evt.files[0]);

  }

  private errorHandler(evt): void {
    switch (evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    }
  }

}
