import { Injectable } from '@nestjs/common';
import { Project } from '../projects/project';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { DeployTask } from '../deploy-tasks/deploy-task';
import { createHmac, timingSafeEqual } from 'crypto';

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

  public verifyGithubSignature(payloadBody: string, signature: string) {
    const trust = createHmac('sha256', '12345678')
      .update(payloadBody)
      .digest('hex');
    const trustSignature = `sha256=${trust}`;
    return timingSafeEqual(
      Buffer.from(trustSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8'),
    );
  }
}
