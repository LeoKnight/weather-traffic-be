import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Traffic } from './entities/traffic.entity';
import { Weather } from './entities/weather.entity';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Traffic, Weather])],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
