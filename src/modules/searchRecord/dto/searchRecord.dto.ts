import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSearchRecord {
  search_date_time: string;
  user_id: string;
  location: string;
}

export class SearchRecordPeriodReqDTO {
  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsNotEmpty()
  end: string;
}
