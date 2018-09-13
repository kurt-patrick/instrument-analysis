import { DataService } from './shared/data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingModule } from 'ngx-loading';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { CustomQueryComponent } from './stats/custom-query/custom-query.component';
import { DailyRangeComponent } from './stats/daily-range/daily-range.component';
import { DailyRangeContainerComponent } from './stats/daily-range-container/daily-range-container.component';
import { FileImportComponent } from './file-import/file-import.component';
import { TopToolbarComponent } from './top-toolbar/top-toolbar.component';
import { BarDataPaginatedComponent } from './bar-data-paginated/bar-data-paginated.component';
import { CommonQueriesComponent } from './stats/common-queries/common-queries.component';
import { OpenAboveYestCloseComponent } from './stats/OpenAbove/open-above-yest-close/open-above-yest-close.component';
import { OpenAboveYestHighComponent } from './stats/OpenAbove/open-above-yest-high/open-above-yest-high.component';
import { OpenBelowYestLowComponent } from './stats/OpenBelow/open-below-yest-low/open-below-yest-low.component';
import { OpenBelowYestCloseComponent } from './stats/OpenBelow/open-below-yest-close/open-below-yest-close.component';
import { RiskRewardComponent } from './risk-reward/risk-reward.component';

const appRoutes: Routes = [
  { path: 'data/import', component: FileImportComponent },
  { path: 'import', component: FileImportComponent },
  { path: 'daily-range', component: DailyRangeContainerComponent },
  { path: 'common-query', component: CommonQueriesComponent },
  { path: 'custom-query', component: CustomQueryComponent },
  { path: 'openAboveYestClose', component: OpenAboveYestCloseComponent },
  { path: 'openAboveYestHigh', component: OpenAboveYestHighComponent  },
  { path: 'openBelowYestClose', component: OpenBelowYestCloseComponent  },
  { path: 'openBelowYestLow', component: OpenBelowYestLowComponent },
  { path: 'riskReward', component: RiskRewardComponent },
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
    CommonQueriesComponent,
    OpenAboveYestCloseComponent,
    OpenAboveYestHighComponent,
    OpenBelowYestLowComponent,
    OpenBelowYestCloseComponent,
    RiskRewardComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    BrowserModule,
    LoadingModule,
    ChartsModule
  ],
  providers: [ DataService ],
  bootstrap: [
    AppComponent,
    TopToolbarComponent,
    FileImportComponent
  ]
})
export class AppModule { }
