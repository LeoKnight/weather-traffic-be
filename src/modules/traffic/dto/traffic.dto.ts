import { Geometry } from '../../../type';

export class CreateTrafficDto {
  id?: number;
  image_url: string;
  point: Geometry;
  timestamp: number;
  width: number;
  height: number;
}
