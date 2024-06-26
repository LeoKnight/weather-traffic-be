export interface ITrafficItem {
  timestamp: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  camera_id: string;
  image_metadata: {
    height: number;
    width: number;
    md5: string;
  };
}

export interface Geometry {
  type: 'Point';
  coordinates: [number, number];
}

export interface IAreaMetadata {
  name: string;
  label_location: {
    latitude: number;
    longitude: number;
  };
}

export class MostSearchesReponse {
  from: Date;
  to: Date;
  count: number;
}
