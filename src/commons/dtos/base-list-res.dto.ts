import { ApiProperty } from '@nestjs/swagger';

export class BaseListResDto<T = any> {
  @ApiProperty({
    description: '总记录条数',
  })
  count: number;
  @ApiProperty({
    description: '当前分页记录集合',
    isArray: true,
  })
  records: T[];
  [field: string]: any;
}
