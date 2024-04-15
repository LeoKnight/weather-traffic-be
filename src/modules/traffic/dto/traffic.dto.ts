import { Geometry } from 'src/type';
import { IsNotEmpty } from 'class-validator';

export class TrafficDto {
  id?: number;
  image_url: string;
  point: Geometry;
  date_time: Date;
  width: number;
  height: number;
}

export class TrafficRequest {
  @IsNotEmpty()
  date_time: string;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  latitude: number;
}
