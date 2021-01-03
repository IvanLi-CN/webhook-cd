import { Module } from '@nestjs/common';
import { DeployTasksService } from './deploy-tasks.service';
import { DeployTasksController } from './deploy-tasks.controller';
import { BullModule } from '@nestjs/bull';
import { DeployTaskConsumer } from './deploy-task.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeployTask } from './deploy-task';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'deploy',
    }),
    TypeOrmModule.forFeature([DeployTask]),
  ],
  providers: [DeployTasksService, DeployTaskConsumer],
  controllers: [DeployTasksController],
})
export class DeployTasksModule {}
