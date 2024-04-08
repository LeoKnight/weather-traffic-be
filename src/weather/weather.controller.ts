import {
  Body,
  Controller,
  //   Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/weather.dto';
import { Weather } from './entities/weather.entity';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  create(@Body() createWeather: CreateWeatherDto): Promise<Weather> {
    return this.weatherService.createWeather(createWeather);
  }

  @Get(':timestamp')
  getWeatherByTimeStamp(@Param('timestamp', ParseIntPipe) timestamp: number) {
    return this.weatherService.getWeatherByTimeStamp(timestamp);
  }

  //   @Get(':id')
  //   findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
  //     return this.usersService.findOne(id);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string): Promise<void> {
  //     return this.usersService.remove(id);
  //   }
}
