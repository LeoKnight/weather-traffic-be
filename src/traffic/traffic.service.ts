import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { timestampToDateTime } from '../utils/converter';

import { Traffic } from './entities/traffic.entity';
import { CreateTrafficDto } from './dto/traffic.dto';
import axios from 'axios';
import { ITrafficItem } from '../type';
import { SearchRecordService } from '../searchRecord/searchRecord.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { getTrafficChacheKey } from '../const/cacheKeys';

const trafficImagesAPI = 'https://api.data.gov.sg/v1/transport/traffic-images';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Traffic)
    private readonly trafficRepository: Repository<Traffic>,
    @Inject(SearchRecordService)
    private readonly searchRecordService: SearchRecordService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async fetchTrafficByTimeStamp(
    timestamp: number,
  ): Promise<CreateTrafficDto[]> {
    const dateTime = timestampToDateTime(timestamp);

    try {
      const params = {
        date_time: dateTime,
      };
      const trafficRes = await axios.get(trafficImagesAPI, {
        params,
      });
      const trafficList: ITrafficItem[] = trafficRes.data.items[0].cameras;
      const trafficDtoList: CreateTrafficDto[] = trafficList.map((traffic) => {
        return {
          image_url: traffic.image,
          point: {
            type: 'Point',
            coordinates: [
              traffic.location.longitude,
              traffic.location.latitude,
            ],
          },
          width: traffic.image_metadata.width,
          height: traffic.image_metadata.height,
          timestamp,
          date_time_with_timezone: dateTime,
        };
      });

      this.trafficRepository
        .createQueryBuilder()
        .insert()
        .into(Traffic)
        .values(trafficDtoList)
        .execute();

      return trafficDtoList;
    } catch (error) {
      // error handling
      console.error('Error fetching data from external API:', error);
      throw error;
    }
  }

  async _getTrafficByTimeStampAndLocation(
    timestamp: number,
    longitude: number,
    latitude: number,
  ): Promise<CreateTrafficDto[]> {
    const fiveSecondsAgo = timestamp - 5 * 1000;
    const fiveSecondsLater = timestamp + 5 * 1000;

    const nearTrafficDataList: CreateTrafficDto[] = await this.trafficRepository
      .createQueryBuilder('traffic')
      .where(
        `ST_Distance(traffic.point, ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)) < :radius`,
        { radius: 2000 },
      )
      .andWhere(
        'traffic.timestamp >= :fiveSecondsAgo AND traffic.timestamp <= :fiveSecondsLater',
        { fiveSecondsAgo, fiveSecondsLater },
      )
      .getMany();
    const cacheKey = getTrafficChacheKey(timestamp, longitude, latitude);
    this.cacheManager.set(cacheKey, nearTrafficDataList);
    return nearTrafficDataList;
  }

  async getTrafficByTimeStampAndLocation(
    _timestamp: number,
    longitude: number,
    latitude: number,
  ): Promise<CreateTrafficDto[]> {
    const hour = 60 * 60 * 1000;
    const timestamp = Math.floor(_timestamp / hour) * hour; //Accuracy is 1 hour

    const count =
      await this.searchRecordService.getSearchRecordCount(timestamp);
    if (!count) {
      await this.fetchTrafficByTimeStamp(timestamp);
    }

    const nearTrafficDataList = await this._getTrafficByTimeStampAndLocation(
      timestamp,
      longitude,
      latitude,
    );

    this.searchRecordService.saveSearchRecord(timestamp, longitude, latitude);

    return nearTrafficDataList;
  }
}
