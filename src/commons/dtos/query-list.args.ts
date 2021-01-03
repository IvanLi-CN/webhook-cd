import { IsOptional, IsPositive, IsIn } from 'class-validator';
import { OrderByCondition } from 'typeorm';

export class QueryListArgs {
  @IsOptional()
  @IsPositive()
  pageIndex = 1;

  @IsOptional()
  @IsPositive()
  pageSize = 10;

  @IsOptional()
  @IsIn(['DESC', 'ASC'])
  createdAtOrderBy?: OrderByCondition;
}
