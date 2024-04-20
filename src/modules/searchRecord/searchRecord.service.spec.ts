import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchRecord } from './entities/searchRecord.entity';
import { SearchRecordService } from './searchRecord.service';
import { REQUEST } from '@nestjs/core';
import * as dayjs from 'dayjs';

describe('SearchRecordService', () => {
  let searchRecordService: SearchRecordService;
  let searchRecordRepository: Repository<SearchRecord>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchRecordService,
        {
          provide: getRepositoryToken(SearchRecord),
          useFactory: () => ({
            create: jest.fn(() => {}),
            insert: jest.fn(() => {}),
            find: jest.fn(() => []),
          }),
        },
        {
          provide: REQUEST,
          useValue: {
            cookies: {
              userId: '123',
            },
          },
        },
      ],
    }).compile();
    searchRecordService =
      await module.resolve<SearchRecordService>(SearchRecordService);
    searchRecordRepository = await module.resolve<Repository<SearchRecord>>(
      getRepositoryToken(SearchRecord),
    );
  });
  it('service should be defined', () => {
    expect(searchRecordService).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(searchRecordRepository).toBeDefined();
  });

  describe('createSearchRecord', () => {
    it('should create search record', async () => {
      const dateString = '2024-04-20';
      const location = 'location';
      const insert = jest.fn();
      searchRecordRepository.create = jest.fn().mockReturnValue({ insert });
      await searchRecordService.createSearchRecord(dateString, location);
      expect(searchRecordRepository.create).toHaveBeenCalledWith({
        search_date_time: new Date(Date.parse(dateString)),
        user_id: '123',
        location,
      });
    });
  });
  //getUsersRecentSearchByCurrentUser
  describe('getUsersRecentSearchByCurrentUser', () => {
    it('should get recent search by current user', async () => {
      const find = jest.fn();
      searchRecordRepository.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: find,
      });
      await searchRecordService.getUsersRecentSearchByCurrentUser();
      expect(find).toHaveBeenCalled();
    });
  });

  //getUsersRecentSearchByOthers
  describe('getUsersRecentSearchByOthers', () => {
    it('should get recent search by others', async () => {
      const find = jest.fn();
      searchRecordRepository.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: find,
      });
      await searchRecordService.getUsersRecentSearchByOthers();
      expect(find).toHaveBeenCalled();
    });
  });
  //getMostRecentSearchesByAllUsers
  describe('getMostRecentSearchesByAllUsers', () => {
    it('should get most recent searches by all users', async () => {
      const find = jest.fn();
      searchRecordRepository.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: find,
      });
      await searchRecordService.getMostRecentSearchesByAllUsers();
      expect(find).toHaveBeenCalled();
    });
  });
  //getTop10SearchesByDate
  describe('getTop10SearchesByDate', () => {
    it('should get top 10 searches by date', async () => {
      const date = '2022-04-20'; // 假设日期是有效的
      const expectedResult = [
        {
          search_date_time: '2022-04-20 12:00:00',
          location: 'Bedok',
          searchCount: 5,
        },
      ];
      const find = jest.fn().mockResolvedValue(expectedResult);
      searchRecordRepository.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: find,
      });
      const result = await searchRecordService.getTop10SearchesByDate(date);
      expect(result).toEqual(expectedResult);
    });
  });

  //_findSearcheCountEachAHour
  describe('_findSearcheCountEachAHour', () => {
    it('should return search count each hour', () => {
      const searchesData = [
        { created_date: dayjs('2022-04-20T12:00:00').toDate() },
        { created_date: dayjs('2022-04-20T12:30:00').toDate() },
        { created_date: dayjs('2022-04-20T12:59:00').toDate() },
        { created_date: dayjs('2022-04-20T13:30:00').toDate() },
      ];
      const result =
        searchRecordService['_findSearcheCountEachAHour'](searchesData);
      expect(result).toEqual([
        {
          from: dayjs('2022-04-20T12:00:00').toDate(),
          to: dayjs('2022-04-20T13:00:00').toDate(),
          count: 3,
        },
        {
          from: dayjs('2022-04-20T13:30:00').toDate(),
          to: dayjs('2022-04-20T14:30:00').toDate(),
          count: 1,
        },
      ]);
    });
  });
});
