import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Traffic } from './entities/traffic.entity';
import { TrafficDto } from './dto/traffic.dto';
import { SearchRecordService } from '../searchRecord/searchRecord.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { getTrafficChacheKey } from 'src/constants/cacheKeys';
import { ExternalApiService } from 'src/modules/external-api/external-api.service';
import * as dayjs from 'dayjs';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Traffic)
    private readonly trafficRepository: Repository<Traffic>,
    @Inject(SearchRecordService)
    private readonly searchRecordService: SearchRecordService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly externalApiService: ExternalApiService,
  ) {}

  // this.trafficRepository
  //       .createQueryBuilder()
  //       .insert()
  //       .into(Traffic)
  //       .values(trafficDtoList)
  //       .execute();
  async _getTrafficByTimeStampAndLocation(
    date_time: string,
    longitude: number,
    latitude: number,
  ): Promise<TrafficDto[]> {
    const fiveSecondsAgo = dayjs(date_time)
      .subtract(5, 's')
      .format('YYYY-MM-DD HH:mm:ssZ');
    const fiveSecondsLater = dayjs(date_time)
      .add(5, 's')
      .format('YYYY-MM-DD HH:mm:ssZ');

    const nearTrafficDataList: TrafficDto[] = await this.trafficRepository
      .createQueryBuilder('traffic')
      .where(
        `ST_Distance(traffic.point, ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)) < :radius`,
        { radius: 2000 },
      )
      .andWhere(
        'traffic.date_time >= :fiveSecondsAgo AND traffic.date_time <= :fiveSecondsLater',
        {
          fiveSecondsAgo: fiveSecondsAgo,
          fiveSecondsLater: fiveSecondsLater,
        },
      )
      .getMany();
    const cacheKey = getTrafficChacheKey(date_time, longitude, latitude);
    this.cacheManager.set(cacheKey, nearTrafficDataList);
    return nearTrafficDataList;
  }

  async getTrafficByDateAndLocation(
    date_time: string,
    longitude: number,
    latitude: number,
  ): Promise<TrafficDto[]> {
    // const hour = 60 * 60 * 1000;
    // const timestamp = Math.floor(_timestamp / hour) * hour; //Accuracy is 1 hour

    const count =
      await this.searchRecordService.getSearchRecordCount(date_time);
    debugger;
    if (!count) {
      await this.externalApiService.fetchTrafficByDate(date_time);
    }

    const nearTrafficDataList = await this._getTrafficByTimeStampAndLocation(
      date_time,
      longitude,
      latitude,
    );

    this.searchRecordService.saveSearchRecord(date_time, longitude, latitude);

    return nearTrafficDataList;
  }
}
