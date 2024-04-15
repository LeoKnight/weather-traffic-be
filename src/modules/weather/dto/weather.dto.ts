import { Geometry } from 'src/type';
import { IsNotEmpty } from 'class-validator';

export class WeatherDto {
  id?: number;
  name: string;
  point: Geometry;
  date_time: string;
  valid_period_start: string;
  valid_period_end: string;
  forecast: string;
}

export class WeaterRequest {
  @IsNotEmpty()
  date_time: string;
}
