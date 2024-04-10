import { Geometry } from '../../type';

export class CreateTrafficDto {
  image_url: string;
  point: Geometry;
  timestamp: number;
}
