import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SearchRecord } from './entities/searchRecord.entity';
import { MostSearchesReponse } from 'src/type';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

@Injectable({ scope: Scope.REQUEST })
export class SearchRecordService {
  constructor(
    @InjectRepository(SearchRecord)
    private readonly searchRecordRepository: Repository<SearchRecord>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async createSearchRecord(
    dateString: string,
    location: string,
  ): Promise<void> {
    const newSearch = this.searchRecordRepository.create({
      search_date_time: dayjs(dateString).toDate(),
      user_id: this.request.cookies.userId,
      location,
    });
    await this.searchRecordRepository.insert(newSearch);
  }

  async getUsersRecentSearchByCurrentUser(): Promise<SearchRecord[]> {
    return await this.searchRecordRepository
      .createQueryBuilder()
      .select(['search_date_time, location'])
      .where('user_id=:id', { id: this.request.cookies.userId })
      .orderBy('created_date', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getUsersRecentSearchByOthers(): Promise<SearchRecord[]> {
    return await this.searchRecordRepository
      .createQueryBuilder()
      .select(['search_date_time, location'])
      .where('user_id<>:id', { id: this.request.cookies.userId })
      .orderBy('created_date', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getMostRecentSearchesByAllUsers(): Promise<SearchRecord[]> {
    return await this.searchRecordRepository
      .createQueryBuilder()
      .select(['search_date_time, location, created_date'])
      .orderBy('created_date', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getTop10SearchesByDate(date: string): Promise<any> {
    const startOfDay = this._getStartOfDate(date);
    const endOfDay = this._getEndOfDate(date);

    return await this.searchRecordRepository
      .createQueryBuilder()
      .select([
        'search_date_time',
        'location',
        'COUNT(location) as searchCount',
      ])
      .where('created_date BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .groupBy('search_date_time, location')
      .orderBy('searchCount', 'DESC')
      .limit(10)
      .getRawMany();
  }
  async mostSearchesWithinOneHour(date: string): Promise<MostSearchesReponse> {
    const startOfDay = this._getStartOfDate(date);
    const endOfDay = this._getEndOfDate(date);

    const searchesData = await this.searchRecordRepository
      .createQueryBuilder()
      .select(['created_date'])
      .where('created_date BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .orderBy('created_date', 'ASC')
      .getRawMany();

    const searchCountResult = this._findSearcheCountEachAHour(searchesData);
    searchCountResult.sort((a, b) => b.count - a.count);
    return searchCountResult[0];
  }

  private _findSearcheCountEachAHour(datas): MostSearchesReponse[] {
    debugger;
    const mostSearchesArr = datas.reduce(
      (
        acc,
        current: {
          created_date: Date;
        },
      ) => {
        // new range
        if (acc.length === 0) {
          acc.push({
            from: current.created_date,
            to: dayjs(current.created_date).add(1, 'hour').toDate(),
            count: 1,
          });
          return acc;
        }
        // finded the range
        const rangeIndex = acc.findIndex((e) =>
          dayjs(current.created_date).isBetween(
            dayjs(e.from),
            dayjs(e.to),
            's',
            '[]',
          ),
        );
        if (rangeIndex > -1) {
          acc[rangeIndex].count += 1;
        } else {
          acc.push({
            from: current.created_date,
            to: dayjs(current.created_date).add(1, 'hour').toDate(),
            count: 1,
          });
        }
        return acc;
      },
      [],
    );

    return mostSearchesArr;
  }

  private _getStartOfDate(date: string): Date {
    return dayjs(date).startOf('day').toDate();
  }

  private _getEndOfDate(date: string): Date {
    return dayjs(date).endOf('day').toDate();
  }
}
