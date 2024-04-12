import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { reverseDateFormat } from '../utils';
import { CreateSearchRecord } from '../modules/searchRecord/dto/searchRecord.dto';

@Injectable()
export class DateValidationPipe implements PipeTransform<any> {
  async transform(value: string): Promise<any> {
    const object: any = plainToClass(CreateSearchRecord, { date: value });
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid date value');
    }

    //string to valid date
    const dateValue = new Date(Date.parse(value));

    if (dateValue instanceof Date) {
      return reverseDateFormat(value);
    }

    throw new BadRequestException('Invalid date format');
  }
}
