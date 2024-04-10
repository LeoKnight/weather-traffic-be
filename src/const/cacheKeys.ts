export const getWeatherChacheKey = (timestamp: number) =>
  `weather_${timestamp}`;

export const getTrafficChacheKey = (
  timestamp: number,
  longitude: number,
  latitude: number,
) => `traffic_${timestamp}_${longitude}_${latitude}`;
