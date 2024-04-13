import { Geometry } from '../../../type';
import { IsNotEmpty } from 'class-validator';

export class CreateWeatherDto {
  name: string;
  point: Geometry;
  timestamp: string;
  valid_period_start: string;
  valid_period_end: string;
  forecast: string;
}

export class WeaterRequest {
  @IsNotEmpty()
  date_time: string;
}
