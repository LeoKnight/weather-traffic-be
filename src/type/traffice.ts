export interface ITrafficImagesResponse {
  items: [
    {
      timestamp: number;
      cameras: ITrafficImagesItems[];
    },
  ];
}

export interface ITrafficImagesItems {
  timestamp: number;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  camera_id: string;
  image_metadata: {
    width: number;
    height: number;
  };
}
