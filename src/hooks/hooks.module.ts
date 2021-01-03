import { Module } from '@nestjs/common';
import { HooksController } from './hooks.controller';
import { HooksService } from './hooks.service';
import { BullModule } from '@nestjs/bull';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    ProjectsModule,
    BullModule.registerQueue({
      name: 'deploy',
    }),
  ],
  controllers: [HooksController],
  providers: [HooksService],
})
export class HooksModule {}
