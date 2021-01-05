import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { DeployTask } from './deploy-task';
import { DeployTasksService } from './deploy-tasks.service';

@Processor('deploy')
export class DeployTaskConsumer {
  constructor(private readonly service: DeployTasksService) {}
  @Process()
  async consume(job: Job<DeployTask>) {
    const task = await this.service.createTask(job.data);
    console.log(task);
    await job.progress(task.status);
    await this.service.pullCode(task);
    await job.progress(task.status);
    await this.service.install(task);
    await job.progress(task.status);
    await this.service.test(task);
    await job.progress(task.status);
    await this.service.deploy(task);
    await job.progress(task.status);
  }
}
