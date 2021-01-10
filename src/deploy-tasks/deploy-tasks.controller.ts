import { Controller, Get, Post, Query } from '@nestjs/common';
import { DeployTasksService } from './deploy-tasks.service';
import { QueryDeployTasksArgs } from './dtos/query-deploy-tasks.args';

@Controller('deploy-tasks')
export class DeployTasksController {
  constructor(private readonly service: DeployTasksService) {}

  @Get()
  public async getList(@Query() args: QueryDeployTasksArgs) {
    return await this.service.getList(args);
  }

  @Post()
  public async createOne() {
    return;
  }
}
