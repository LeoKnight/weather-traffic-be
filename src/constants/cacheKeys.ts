export const getWeatherChacheKey = (date: string) => `weather_${date}`;

export const getTrafficChacheKey = (
  date: string,
  longitude: number,
  latitude: number,
) => `traffic_${date}_${longitude}_${latitude}`;
