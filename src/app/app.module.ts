import { DataService } from './shared/data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { CustomQueryComponent } from './stats/custom-query/custom-query.component';
import { DailyRangeComponent } from './stats/daily-range/daily-range.component';
import { DailyRangeContainerComponent } from './stats/daily-range-container/daily-range-container.component';
import { FileImportComponent } from './file-import/file-import.component';
import { TopToolbarComponent } from './top-toolbar/top-toolbar.component';
import { BarDataPaginatedComponent } from './bar-data-paginated/bar-data-paginated.component';
import { CommonQueriesComponent } from './stats/common-queries/common-queries.component';

const appRoutes: Routes = [
  { path: 'data/import', component: FileImportComponent },
  { path: 'import', component: FileImportComponent },
  { path: 'daily-range', component: DailyRangeContainerComponent },
  { path: 'common-query', component: CommonQueriesComponent },
  { path: 'custom-query', component: CustomQueryComponent },
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
    FileImportComponent,
    DailyRangeComponent,
    DailyRangeContainerComponent,
    BarDataPaginatedComponent,
    CustomQueryComponent,
    CommonQueriesComponent
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
