import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../commons/entities/app-base-entity';
import { Project } from '../projects/project';
import { DeployTaskStatuses } from './deploy-task-statuses.enum';

@Entity()
export class DeployTask extends AppBaseEntity {
  @Column()
  projectId: string;
  @ManyToOne(() => Project)
  project: Project;
  @Column({ enum: DeployTaskStatuses })
  status: DeployTaskStatuses;
  @Column({ nullable: true })
  finishedAt: Date;
  @Column({ nullable: true })
  sourcePath: string;

  static createTask(project: Project) {
    const instance = new DeployTask();
    instance.project = project;
    instance.projectId = project.id;
    instance.status = DeployTaskStatuses.pending;
    return instance;
  }
}
