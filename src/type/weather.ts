export interface IWeatherDataResponse {
  area_metadata: IAreaMetaData[];
  items: WeaterItem[];
}

export interface WeaterItem {
  timestamp: string;
  valid_period: IValidPeriod;
  forecasts: IForecasts[];
}

export interface IValidPeriod {
  start: string;
  end: string;
}

export interface IAreaMetaData {
  name: string;
  label_location: {
    longitude: number;
    latitude: number;
  };
}

export interface IForecasts {
  area: string;
  forecast: string;
}
