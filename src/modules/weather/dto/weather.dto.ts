import { Geometry } from '../../../type';

export interface IValidPeriod {
  start: Date;
  end: Date;
}

export interface IForecast {
  area: string;
  forecast: string;
}
export class CreateWeatherDto {
  name: string;
  point: Geometry;
  timestamp: number;
  valid_period_start: Date;
  valid_period_end: Date;
  forecast: string;
}
