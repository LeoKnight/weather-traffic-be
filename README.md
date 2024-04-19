
## Features:

- [x] Allow the user to choose a date and time, then show a list of locations with traffic cam photos for the specified date and time. (API 1: Traffic Images)
- [x] Show the list of locations from API 1 (Traffic Images) only has lat/long without name, use a reverse geocoding service (API 2: Weather Forecast) to display more user friendly location names
- [x] When the user selects a location from the list, show the traffic cam photo, and also the weather info for that location from API 2 (Weather Forecast) (or the nearest available weather info depending on what API 2 can return)
- [x] Using browser cache or other methods, recommend to the user his/her most recent searches and 
- [x] Report generation: the most recent searches of other people.
- [x] Create an api to retrieve the most recent 10 date time + location searched by all users consolidated.
- [x] Create an api to retrieve the top 10 date time + location searched within a period. c. Create an api to retrieve the period of which there are most searches performed.

## The technology stack used in this project

* NestJS
* TypeScript
* TypeORM
* PostgreSQL + postgis
* dayjs
  
## Installation

```bash
$ pnpm install
```

## Running the app

Run docker to set up database.Install docker then

```bash
docker-compose up -d
```

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

### Report api
a. Create an api to retrieve the most recent 10 date time + location searched by all users consolidated.

```bash
# api/searchRecord/most-recent-search-by-all-users
curl --location 'localhost:3001/api/searchRecord/recent-search-by-all-users'
```
result
```json
[
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Queenstown",
        "created_date": "2024-04-19T09:31:00.955Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Punggol",
        "created_date": "2024-04-19T09:30:57.740Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Pulau_Ubin",
        "created_date": "2024-04-19T09:30:56.001Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Choa_Chu_Kang",
        "created_date": "2024-04-19T09:30:51.078Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Changi",
        "created_date": "2024-04-19T09:30:50.046Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Central_Water_Catchment",
        "created_date": "2024-04-19T09:30:48.748Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Bukit_Timah",
        "created_date": "2024-04-19T09:30:46.996Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Bukit_Panjang",
        "created_date": "2024-04-19T09:30:44.669Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Bukit_Merah",
        "created_date": "2024-04-19T09:30:39.069Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Bukit_Batok",
        "created_date": "2024-04-19T09:30:37.411Z"
    }
]
```

b. Create an api to retrieve the top 10 date time + location searched within a period.
   
```bash
# fetch api/searchRecord/top-searches-in-period
curl --location 'localhost:3001/api/searchRecord/top10-searches-in-day?date=2024-04-19T12%3A25%3A30'
```
result
```json
[
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Queenstown",
        "created_date": "2024-04-19T09:31:00.955Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Punggol",
        "created_date": "2024-04-19T09:30:57.740Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Pulau_Ubin",
        "created_date": "2024-04-19T09:30:56.001Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Choa_Chu_Kang",
        "created_date": "2024-04-19T09:30:51.078Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Changi",
        "created_date": "2024-04-19T09:30:50.046Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Central_Water_Catchment",
        "created_date": "2024-04-19T09:30:48.748Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Bukit_Timah",
        "created_date": "2024-04-19T09:30:46.996Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Bukit_Panjang",
        "created_date": "2024-04-19T09:30:44.669Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Bukit_Merah",
        "created_date": "2024-04-19T09:30:39.069Z"
    },
    {
        "search_date_time": "2024-04-08T18:00:00.000Z",
        "location": "Bukit_Batok",
        "created_date": "2024-04-19T09:30:37.411Z"
    }
]
```

c. Create an api to retrieve the period of which there are most searches performed.

```bash
# api/searchRecord/most-searches-within-one-hour
curl --location 'localhost:3001/api/searchRecord/most-searches-within-one-hour?date=2024-04-19T12%3A25%3A30'
```
result 

```json
{
    "from": "2024-04-19T09:11:19.589Z",
    "to": "2024-04-19T10:11:19.589Z",
    "count": 30
}
```
