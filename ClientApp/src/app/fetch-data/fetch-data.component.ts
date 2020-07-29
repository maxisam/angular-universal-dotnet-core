import { Component, OnInit } from '@angular/core';

import { IWeatherForecast, WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
})
export class FetchDataComponent implements OnInit {
  public forecasts: IWeatherForecast[];

  constructor(private _WeatherServiceService: WeatherService) {}
  ngOnInit(): void {
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
