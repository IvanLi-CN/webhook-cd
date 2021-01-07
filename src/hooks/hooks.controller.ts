import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HooksService } from './hooks.service';
import { ProjectsService } from '../projects/projects.service';
import { GithubWebhookGuard } from './github-webhook.guard';

@Controller('hooks')
export class HooksController {
  constructor(
    private readonly service: HooksService,
    private readonly projectsService: ProjectsService,
  ) {}
  @Post(':projectId')
  @UseGuards(GithubWebhookGuard)
  async createInfo(@Param('projectId') projectId, @Body() body) {
    const project = await this.projectsService.getOne(projectId);
    await this.service.deploy(project);
    return {
      message: 'success',
    };
  }
  @Get('')
  async getHookUrl() {
    return {
      test: 'message',
      date: new Date(),
    };
  }
}
