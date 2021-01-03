import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectReq } from './dtos/create-project.req';
import { UpdateProjectReq } from './dtos/update-project.req';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get()
  public async getList() {
    return await this.service.getList();
  }

  @Post()
  public async createOne(@Body() dto: CreateProjectReq) {
    return await this.service.createOne(dto);
  }

  @Put(':id')
  public async updateOne(
    @Param('id') id: string,
    @Body() dto: UpdateProjectReq,
  ) {
    return await this.service.updateOne(id, dto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }
}
