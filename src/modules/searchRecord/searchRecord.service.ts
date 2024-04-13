import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SearchRecord } from './entities/searchRecord.entity';

@Injectable()
export class SearchRecordService {
  constructor(
    @InjectRepository(SearchRecord)
    private readonly searchRecordRepository: Repository<SearchRecord>,
  ) {}

  //save record
  async saveSearchRecord(
    date_time: string,
    longitude: number,
    latitude: number,
  ) {
    let searchRecord = await this.searchRecordRepository.findOne({
      where: { date_time: new Date(date_time), longitude, latitude },
    });

    if (!searchRecord) {
      searchRecord = new SearchRecord();
      searchRecord.date_time = new Date(date_time);
      searchRecord.longitude = longitude;
      searchRecord.latitude = latitude;
      searchRecord.count = 1;
      searchRecord.search_time = new Date();
    } else {
      searchRecord.count++;
    }

    await this.searchRecordRepository.save(searchRecord);
  }

  async getSearchRecordCount(
    date_time: string,
    longitude?: number,
    latitude?: number,
  ) {
    const searchRecord = await this.searchRecordRepository.findOne({
      where: { date_time: new Date(date_time), longitude, latitude },
    });

    return searchRecord?.count;
  }

  //Create an api to retrieve the top 10 date time + location searched within a period.
  async getTopSearchRecordByPeriod(from: number, to: number) {
    const topSearches = await this.searchRecordRepository
      .createQueryBuilder('searchRecord')
      .select(['search.timestamp', 'search.location', 'search.count'])
      .where('search.timestamp BETWEEN :startTime AND :endTime', { from, to })
      .orderBy('search.count', 'DESC')
      .limit(10)
      .getMany();

    return topSearches;
  }

  //Create an api to retrieve the period of which there are most searches performed.
  async getMostSearchPeriod() {
    const mostSearchPeriod = await this.searchRecordRepository
      .createQueryBuilder('searchRecord')
      //   .select('search.timestamp')
      .groupBy('search.timestamp')
      .orderBy('COUNT(search.timestamp)', 'DESC')
      .limit(1)
      .getOne();

    return mostSearchPeriod;
  }

  //   Create an api to retrieve the most recent 10 date time + location searched by all
  async getRecentSearchRecord() {
    const recentSearches = await this.searchRecordRepository
      .createQueryBuilder('searchRecord')
      //   .select(['search.timestamp', 'search.location'])
      .orderBy('search.timestamp', 'DESC')
      .limit(10)
      .getMany();

    return recentSearches;
  }
}
