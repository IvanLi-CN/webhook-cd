import { Injectable } from '@nestjs/common';
import { Project } from '../projects/project.entry';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { DeployTask } from '../deploy-tasks/deploy-task';

@Injectable()
export class HooksService {
  constructor(
    @InjectQueue('deploy')
    private readonly deployQueue: Queue<DeployTask>,
  ) {}

  public getHookUrl(project: Project) {
    return `/hooks/${project.id}`;
  }

  public async deploy(project: Project) {
    await this.deployQueue.add(DeployTask.createTask(project));
  }
}
