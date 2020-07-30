import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterComponent } from 'src/app/counter/counter.component';
import { FetchDataOnDemandComponent } from 'src/app/fetch-data-on-demand/fetch-data-on-demand.component';
import { FetchDataComponent } from 'src/app/fetch-data/fetch-data.component';
import { HomeComponent } from 'src/app/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  { path: 'fetch-data-on-demand', component: FetchDataOnDemandComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
