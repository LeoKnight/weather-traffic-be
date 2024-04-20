import { REQUEST } from '@nestjs/core';
import { TestingModule, Test } from '@nestjs/testing';
import { SearchRecordController } from './searchRecord.controller';
import { SearchRecordService } from './searchRecord.service';
import * as dayjs from 'dayjs';

describe('SearchRecordController', () => {
  let searchRecordController: SearchRecordController;
  let searchRecordService: SearchRecordService;

  const mockData = [
    {
      search_date_time: dayjs('2024-04-08T18:00:00.000Z').toDate(),
      id: 1,
      location: 'Queenstown',
      created_date: dayjs('2024-04-08T18:00:00.000Z').toDate(),
      user_id: '123',
    },
    {
      search_date_time: dayjs('2024-04-08T18:00:00.000Z').toDate(),
      id: 2,
      location: 'Punggol',
      created_date: dayjs('2024-04-19T09:30:57.740Z').toDate(),
      user_id: '234',
    },
    {
      search_date_time: dayjs('2024-04-08T18:00:00.000Z').toDate(),
      id: 3,
      location: 'Pulau_Ubin',
      created_date: dayjs('2024-04-19T09:30:56.001Z').toDate(),
      user_id: '345',
    },
  ];

  const [currentUserData, ...othersUserData] = mockData;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchRecordController],
      providers: [
        {
          provide: SearchRecordService,
          useValue: {
            createSearchRecord: jest.fn(),
            getUsersRecentSearchByCurrentUser: jest.fn(),
            getUsersRecentSearchByOthers: jest.fn(),
            getMostRecentSearchesByAllUsers: jest.fn(),
            getTop10SearchesByDate: jest.fn(),
            mostSearchesWithinOneHour: jest.fn(),
          },
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

    searchRecordController = module.get<SearchRecordController>(
      SearchRecordController,
    );
    searchRecordService = module.get<SearchRecordService>(SearchRecordService);
  });

  it('should be defined', () => {
    expect(searchRecordController).toBeDefined();
  });

  describe('recent-search-by-current-user', () => {
    it('Should be called correctly', async () => {
      await searchRecordController.getRecentSearchByCurrentUser();
      expect(
        searchRecordService.getUsersRecentSearchByCurrentUser,
      ).toHaveBeenCalled();
    });

    it('should return data when call recent search by current user', async () => {
      jest
        .spyOn(searchRecordService, 'getUsersRecentSearchByCurrentUser')
        .mockResolvedValue(Promise.resolve([currentUserData]));

      const result =
        await searchRecordController.getRecentSearchByCurrentUser();
      expect(result).toEqual([currentUserData]);
    });
  });

  describe('recent-search-by-others', () => {
    it('Should be called correctly', async () => {
      await searchRecordController.getRecentSearch();
      expect(
        searchRecordService.getUsersRecentSearchByOthers,
      ).toHaveBeenCalled();
    });

    it('should return data when call recent search from others', async () => {
      jest
        .spyOn(searchRecordService, 'getUsersRecentSearchByCurrentUser')
        .mockResolvedValue(Promise.resolve([...othersUserData]));

      const result =
        await searchRecordController.getRecentSearchByCurrentUser();
      expect(result).toEqual([...othersUserData]);
    });
  });

  describe('recent-search-by-all-users', () => {
    it('Should be called correctly', async () => {
      await searchRecordController.getRecentSearchByUser();
      expect(
        searchRecordService.getMostRecentSearchesByAllUsers,
      ).toHaveBeenCalled();
    });

    it('should return data when call recent search from others', async () => {
      jest
        .spyOn(searchRecordService, 'getUsersRecentSearchByCurrentUser')
        .mockResolvedValue(Promise.resolve(mockData));

      const result =
        await searchRecordController.getRecentSearchByCurrentUser();
      expect(result).toEqual(mockData);
    });
  });

  //top10-searches-in-day
  describe('top10-searches-in-day', () => {
    it('Should be called correctly', async () => {
      const date = '2024-04-08';
      await searchRecordController.getMostSearchesByDate(date);
      expect(searchRecordService.getTop10SearchesByDate).toHaveBeenCalledWith(
        date,
      );
    });

    it('should return data when call top10-searches-in-day', async () => {
      const date = '2024-04-08';
      const mockResponse = {
        date: '2024-04-08',
        most_searched: [
          {
            location: 'Queenstown',
            count: 1,
          },
        ],
      };

      jest
        .spyOn(searchRecordService, 'getTop10SearchesByDate')
        .mockResolvedValue(Promise.resolve(mockResponse));

      const result = await searchRecordController.getMostSearchesByDate(date);
      expect(result).toEqual(mockResponse);
    });
  });

  //most-searches-within-one-hour
  describe('most-searches-within-one-hour', () => {
    it('Should be called correctly', async () => {
      const date = '2024-04-18T18:00:00.000Z';
      await searchRecordController.mostSearchesWithinOneHour(date);
      expect(
        searchRecordService.mostSearchesWithinOneHour,
      ).toHaveBeenCalledWith(date);
    });

    it('should return data when call most-searches-within-one-hour', async () => {
      const date = '2024-04-18T18:00:00.000Z';
      const mockResponse = {
        from: dayjs(date).toDate(),
        to: dayjs(date).toDate(),
        count: 1,
      };

      jest
        .spyOn(searchRecordService, 'mostSearchesWithinOneHour')
        .mockResolvedValue(Promise.resolve(mockResponse));
      const result =
        await searchRecordController.mostSearchesWithinOneHour(date);
      expect(result).toEqual(mockResponse);
    });
  });
});
