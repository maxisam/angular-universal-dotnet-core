import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}
  baseUrl = '/';
  data(): Observable<IWeatherForecast[]> {
    return this.http.get<IWeatherForecast[]>(
      this.baseUrl + 'api/weatherforecast'
    );
  }
}
export interface IWeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
