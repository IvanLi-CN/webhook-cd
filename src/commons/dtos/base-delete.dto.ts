import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ToInt, ToBoolean } from '@neuralegion/class-sanitizer/dist';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseDeleteDto {
  @IsOptional()
  @ToInt(10, { each: true })
  @IsArray()
  @ArrayMinSize(0)
  @IsInt({ each: true })
  @ApiPropertyOptional({
    minItems: 1,
    type: [Number],
    description: '通过 id 数组指定目标',
    default: [],
  })
  ids?: number[] = [];
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @ApiPropertyOptional({
    default: false,
    description: '反删除',
  })
  isReverse = false;
}
