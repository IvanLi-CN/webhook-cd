import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from './project';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDbService } from '../commons/services/base-db.service';
import { TypeormHelper } from '../commons/services/typeorm-helper';

@Injectable()
export class ProjectsService extends BaseDbService<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) {
    super();
  }

  public async getList() {
    const projectAlias = 'project';
    const qb = this.repository.createQueryBuilder(projectAlias);
    TypeormHelper.baseQuery(qb, projectAlias, {});
    return await this.getListResult(qb);
  }

  public async createOne(dto: Partial<Project>) {
    await this.isDuplicateEntity(this.repository, dto, ['name']);
    return await this.repository.save(this.repository.create(dto));
  }

  public async updateOne(id: string, dto: Partial<Project>) {
    const old = await this.repository.findOneOrFail(id);
    await this.isDuplicateEntityForUpdate(this.repository, id, dto, ['name']);
    return await this.repository.update(id, dto);
  }

  async remove(id: string) {
    await this.repository.update(id, { isDelete: true });
  }

  async getOne(id: string) {
    return this.repository.findOneOrFail({ id });
  }
}
