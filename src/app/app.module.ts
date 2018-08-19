import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TopToolbarComponent } from './top-toolbar/top-toolbar.component';
import { FileImportComponent } from './file-import/file-import.component';

@NgModule({
  declarations: [
    AppComponent,
    TopToolbarComponent,
    FileImportComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    TopToolbarComponent,
    FileImportComponent
  ]
})
export class AppModule { }
