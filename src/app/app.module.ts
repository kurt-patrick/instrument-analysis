import { DataService } from './shared/data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { FileImportComponent } from './file-import/file-import.component';
import { TopToolbarComponent } from './top-toolbar/top-toolbar.component';

const appRoutes: Routes = [
  { path: 'data/import', component: FileImportComponent },
  { path: 'import', component: FileImportComponent },
  { path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  declarations: [
    AppComponent,
    TopToolbarComponent,
    FileImportComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    BrowserModule,
    LoadingModule
  ],
  providers: [ DataService ],
  bootstrap: [
    AppComponent,
    TopToolbarComponent,
    FileImportComponent
  ]
})
export class AppModule { }
