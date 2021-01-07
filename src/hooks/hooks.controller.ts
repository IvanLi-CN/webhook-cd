import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
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
  async createInfo(
    @Param('projectId') projectId,
    @Body() body,
    @Headers('X-Hub-Signature-256') signature: string,
  ) {
    const project = await this.projectsService.getOne(projectId);
    if (
      !this.service.verifyGithubSignature(
        JSON.stringify(body),
        signature,
        project.webhookSecret,
      )
    ) {
      throw new UnauthorizedException('signature is wrong!');
    }
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
