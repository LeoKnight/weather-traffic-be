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

  private _getTrafficTimeRange(date_time: string): [string, string] {
    const oneMinAgo = dayjs(date_time).subtract(1, 'm').toISOString();
    const oneMinLater = dayjs(date_time).add(1, 'm').toISOString();

    return [oneMinAgo, oneMinLater];
  }
  private async _getTrafficByTimeStampAndLocation(
    date_time: string,
    longitude: number,
    latitude: number,
  ): Promise<TrafficDto[]> {
    const [oneMinAgo, oneMinLater] = this._getTrafficTimeRange(date_time);

    const nearTrafficDataList: TrafficDto[] = await this.trafficRepository
      .createQueryBuilder('traffic')
      .where(
        `ST_Distance(traffic.point, ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)) < :radius`,
        { radius: 2000 },
      )
      .andWhere(
        'traffic.date_time >= :oneMinAgo AND traffic.date_time <= :oneMinLater',
        {
          oneMinAgo,
          oneMinLater,
        },
      )
      .getMany();

    return nearTrafficDataList;
  }

  async getTrafficByDateAndLocation(
    date_time: string,
    longitude: number,
    latitude: number,
    location: string,
  ): Promise<TrafficDto[]> {
    const cacheKey = getTrafficChacheKey(date_time, longitude, latitude);
    const cachedTraffic: TrafficDto[] = await this.cacheManager.get(cacheKey);
    if (cachedTraffic) {
      return cachedTraffic;
    }
    await this._findOrCreateTrafficByDate(date_time);

    const nearTrafficDataList = await this._getTrafficByTimeStampAndLocation(
      date_time,
      longitude,
      latitude,
    );

    this.cacheManager.set(cacheKey, nearTrafficDataList);
    await this.searchRecordService.createSearchRecord(date_time, location);

    return nearTrafficDataList;
  }

  // First search the database to see if there is data at that time.
  // If not, fetch it from the external api.
  private async _findOrCreateTrafficByDate(
    date_time: string,
  ): Promise<TrafficDto[]> {
    const [oneMinAgo, oneMinLater] = this._getTrafficTimeRange(date_time);

    const trafficData = await this.trafficRepository
      .createQueryBuilder('traffic')
      .where(
        'traffic.date_time >= :oneMinAgo AND traffic.date_time <= :oneMinLater',
        {
          oneMinAgo,
          oneMinLater,
        },
      )
      .getMany();

    if (trafficData.length > 0) {
      return trafficData;
    }
    const trafficDtoList =
      await this._getTrafficCamByDateFromExternalApi(date_time);
    await this._insertTrafficDataToRepository(trafficDtoList);
    return trafficDtoList;
  }

  private async _insertTrafficDataToRepository(
    trafficDtoList: TrafficDto[],
  ): Promise<void> {
    await this.trafficRepository
      .createQueryBuilder()
      .insert()
      .into(Traffic)
      .values(trafficDtoList)
      .execute();
  }

  private async _getTrafficCamByDateFromExternalApi(
    date_time: string,
  ): Promise<TrafficDto[]> {
    const trafficDtoList: TrafficDto[] =
      await this.externalApiService.fetchTrafficByDate(date_time);
    return trafficDtoList;
  }
}
