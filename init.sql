CREATE EXTENSION IF NOT EXISTS postgis;

-- Create traffic_data table
CREATE TABLE IF NOT EXISTS traffic_data (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(100),
    latitude FLOAT,
    longitude FLOAT,
    timestamp TIMESTAMP
);

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    latitude FLOAT,
    longitude FLOAT,
    timestamp TIMESTAMP
);

-- Insert sample data into traffic_data table
INSERT INTO traffic_data (image_url, latitude, longitude, timestamp)
VALUES
    ('https://images.data.gov.sg/api/traffic-images/2024/04/7078791f-93ea-45f6-98a7-9f7bb2c99b43.jpg', 1.323957439, 103.8728576, '2024-04-08T17:39:37+08:00');

-- Insert sample data into weather_data table
INSERT INTO weather_data (name, latitude, longitude,timestamp)
VALUES
    ('Ang Mo Kio', 1.375, 103.839,'2024-04-08T17:39:37+08:00');
