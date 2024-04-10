
## Features:

Allow the user to choose a date and time, then show a list of locations with traffic cam photos for the specified date and time. (API 1: Traffic Images)
2. Show the list of locations from API 1 (Traffic Images) only has lat/long without name, use a reverse geocoding service (API 2: Weather Forecast) to display more user friendly location names
3. When the user selects a location from the list, show the traffic cam photo, and also the weather info for that location from API 2 (Weather Forecast) (or the nearest available weather info depending on what API 2 can return)
4. Using browser cache or other methods, recommend to the user 1) his/her most recent searches and 2) the most recent searches of other people.
5. Report generation:
a. Create an api to retrieve the most recent 10 date time + location searched by all
users consolidated.
b. Create an api to retrieve the top 10 date time + location searched within a period. c. Create an api to retrieve the period of which there are most searches performed.


## Installation

```bash
$ pnpm install
```

## Running the app

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

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```