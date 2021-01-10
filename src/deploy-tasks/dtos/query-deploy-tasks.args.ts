import { ToDate, ToInt } from '@neuralegion/class-sanitizer/dist';
import { IsUUID, Min } from 'class-validator';

export class QueryDeployTasksArgs {
  @ToDate()
  lastCreatedAt: Date;

  @ToInt()
  @Min(0)
  pageSize: number;

  @IsUUID()
  projectId: string;
}
