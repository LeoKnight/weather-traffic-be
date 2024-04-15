import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Weather } from './entities/weather.entity';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
// import { ExternalApiService } from 'src/modules/external-api/external-api.service';
import { ExternalApiModule } from '../external-api/external-api.module';
// import { SearchRecordService } from '../searchRecord/searchRecord.service';
@Module({
  imports: [TypeOrmModule.forFeature([Weather]), ExternalApiModule],
  providers: [
    WeatherService,
    // ExternalApiService,
    // , SearchRecordService
  ],
  controllers: [WeatherController],
})
export class WeatherModule {}
