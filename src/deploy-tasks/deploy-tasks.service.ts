import { Injectable } from '@nestjs/common';
import { DeployTask } from './deploy-task';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { tmpdir } from 'os';
import { mkdtemp } from 'fs/promises';
import { join } from 'path';
import { gitP, SimpleGit } from 'simple-git';
import { DeployTaskStatuses } from './deploy-task-statuses.enum';
import { spawn } from 'child_process';
import { move } from 'fs-extra';

@Injectable()
export class DeployTasksService {
  constructor(
    @InjectRepository(DeployTask)
    private readonly repository: Repository<DeployTask>,
  ) {}

  public async createTask(task: DeployTask) {
    return await this.repository.save(this.repository.create(task));
  }

  public async pullCode(task: DeployTask) {
    task.status = DeployTaskStatuses.pulling;
    const path = await mkdtemp(
      join(
        tmpdir(),
        `webhook-cd-${task.project.repository.fullName.replace(
          /[\\\/]/,
          '-',
        )}-`,
      ),
    );
    task.sourcePath = path;
    await this.repository.save(task);
    const git: SimpleGit = gitP({});
    await git.clone(task.project.repository.sshUrl, path);
  }

  public async install(task: DeployTask) {
    task.status = DeployTaskStatuses.installing;
    await new Promise<void>((resolve, reject) => {
      const npm = spawn('npm', ['ci'], {
        cwd: task.sourcePath,
      });
      npm.stdout.on('data', (data) => console.log(`stdout: ${data}`));
      npm.stderr.on('data', (data) => console.log(`stderr: ${data}`));
      npm.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('安装失败'));
        }
      });
    });
  }

  public async test(task: DeployTask) {
    task.status = DeployTaskStatuses.testing;
    await new Promise<void>((resolve, reject) => {
      const npm = spawn('npm', ['run', 'test'], {
        cwd: task.sourcePath,
      });
      npm.stdout.on('data', (data) => console.log(`stdout: ${data}`));
      npm.stderr.on('data', (data) => console.log(`stderr: ${data}`));
      npm.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('测试失败'));
        }
      });
    });
  }

  public async deploy(task: DeployTask) {
    task.status = DeployTaskStatuses.deploying;
    const deployPath = join(process.env['DEPLOYMENT_DIR'], task.project.name);
    await move(task.sourcePath, deployPath, {
      overwrite: true,
    });
    task.sourcePath = deployPath;
    await new Promise<void>((resolve, reject) => {
      const npm = spawn('npm', ['run', 'build'], {
        cwd: deployPath,
      });
      npm.stdout.on('data', (data) => console.log(`stdout: ${data}`));
      npm.stderr.on('data', (data) => console.log(`stderr: ${data}`));
      npm.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('构建失败'));
        }
      });
    });
    await new Promise<void>((resolve, reject) => {
      const pm2 = spawn('pm2', ['restart', './app.config.js'], {
        cwd: deployPath,
      });
      pm2.stdout.on('data', (data) => console.log(`stdout: ${data}`));
      pm2.stderr.on('data', (data) => console.log(`stderr: ${data}`));
      pm2.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('部署失败'));
        }
      });
    });
  }
}
