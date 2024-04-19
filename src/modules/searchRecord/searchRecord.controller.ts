import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { SearchRecordService } from './searchRecord.service';
import { SearchRecord } from './entities/searchRecord.entity';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MostSearchesReponse } from 'src/type';

@Controller('api/searchRecord')
export class SearchRecordController {
  constructor(private readonly searchRecordService: SearchRecordService) {}

  @Get('recent-search-by-current-user')
  @ApiResponse({
    status: 201,
    description: 'Recent Search by current User',
    type: SearchRecord,
  })
  async getRecentSearchByCurrentUser(): Promise<SearchRecord[]> {
    return await this.searchRecordService.getUsersRecentSearchByCurrentUser();
  }

  @Get('recent-search-by-others')
  @ApiResponse({
    status: 201,
    description: 'Recent Search by Others',
    type: SearchRecord,
  })
  async getRecentSearch(): Promise<SearchRecord[]> {
    return await this.searchRecordService.getUsersRecentSearchByOthers();
  }

  @Get('recent-search-by-all-users')
  @ApiResponse({
    status: 201,
    description: 'Most recent 10 DateTime + Location searched by all user',
    type: SearchRecord,
  })
  async getRecentSearchByUser(): Promise<SearchRecord[]> {
    return await this.searchRecordService.getMostRecentSearchesByAllUsers();
  }

  @Get('top10-searches-in-day')
  @ApiQuery({
    name: 'date',
    description: '20/04/2024',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Top 10 DateTime + Location within one day',
    type: MostSearchesReponse,
  })
  async getMostSearchesByDate(
    @Param('date') date: string,
  ): Promise<MostSearchesReponse> {
    return await this.searchRecordService.getTop10SearchesByDate(date);
  }

  @Get('most-searches-within-one-hour')
  @ApiQuery({
    name: 'most-searches-within-one-hour',
    description:
      'To return the period of which there is most searches performed within a hour.',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 201,
    description:
      'To return the period of which there is most searches performed within a hour.',
    type: SearchRecord,
  })
  @UsePipes(new ValidationPipe())
  async mostSearchesWithinOneHour(
    @Param('date') date: string,
  ): Promise<MostSearchesReponse> {
    return await this.searchRecordService.mostSearchesWithinOneHour(date);
  }
}
