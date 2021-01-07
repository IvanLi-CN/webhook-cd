import { Module } from '@nestjs/common';
import { HooksController } from './hooks.controller';
import { HooksService } from './hooks.service';
import { BullModule } from '@nestjs/bull';
import { ProjectsModule } from '../projects/projects.module';
import { GithubWebhookGuard } from './github-webhook.guard';

@Module({
  imports: [
    ProjectsModule,
    BullModule.registerQueue({
      name: 'deploy',
    }),
  ],
  controllers: [HooksController],
  providers: [HooksService, GithubWebhookGuard],
})
export class HooksModule {}
