import { PaginationInterface } from '../interfaces/pagination.interface';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { ToBoolean, ToDate, ToInt } from '@neuralegion/class-sanitizer/dist';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseQueryArg implements PaginationInterface {
  @IsOptional()
  @ToInt()
  @Min(0)
  @IsInt()
  @ApiPropertyOptional({
    minimum: 0,
    default: 10,
    description: '每页长度',
  })
  pageSize? = 10;
  @IsOptional()
  @ToInt()
  @Min(1)
  @IsInt()
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: '页码',
  })
  pageIndex? = 1;
  @IsOptional()
  @ToInt()
  @Min(0)
  @IsInt()
  @ApiPropertyOptional({
    minimum: 0,
    default: 10,
    description: '获取记录长度',
  })
  take? = 10;
  @IsOptional()
  @ToInt()
  @Min(0)
  @IsInt()
  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
    description: '跳过记录数量',
  })
  skip? = 0;
  @IsOptional()
  @ToInt()
  @Min(0)
  @IsInt()
  @ApiPropertyOptional({
    minimum: 0,
    description: '通过 id 筛选',
  })
  id?: number;
  @IsOptional()
  @ToInt(10, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @ApiPropertyOptional({
    minItems: 1,
    type: [Number],
    isArray: true,
    description: '通过 id 数组筛选',
  })
  ids?: number[];
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ToDate({ each: true })
  @IsDate({ each: true })
  @ApiPropertyOptional({
    minItems: 2,
    maxItems: 2,
    isArray: true,
    type: [Date, Date],
    description:
      '通过默认时刻范围数组筛选（[ &lt;ISO8601 Date Format&gt;, &lt;ISO8601 Date Format&gt; ]',
    example: ['2019-01-01T00:00:00+08:00', '2020-01-01T00:00:00+08:00'],
  })
  baseDateRange?: [Date, Date];
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @ApiPropertyOptional({
    default: false,
    description: '仅获取已被逻辑删除的记录',
  })
  isDelete? = false;
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @ApiPropertyOptional({
    default: false,
    description: '包含已删除的记录',
  })
  includeDeleted? = false;
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @ApiPropertyOptional({
    default: false,
    description: '仅返回下拉列表必要的数据',
  })
  forDropdown? = false;
}
