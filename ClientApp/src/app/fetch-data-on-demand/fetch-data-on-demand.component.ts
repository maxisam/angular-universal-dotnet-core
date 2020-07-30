import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { IWeatherForecast, WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-fetch-data-on-demand',
  templateUrl: './fetch-data-on-demand.component.html',
})
export class FetchDataOnDemandComponent implements OnInit {
  public forecasts: IWeatherForecast[];
  private isBrowser = false;
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private _WeatherServiceService: WeatherService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this._WeatherServiceService.data().subscribe(
        (result) => {
          this.forecasts = result;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
