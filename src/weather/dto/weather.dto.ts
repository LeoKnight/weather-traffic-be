export class CreateWeatherDto {
  name: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export class CreateTrafficDto {
  image_url: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}
