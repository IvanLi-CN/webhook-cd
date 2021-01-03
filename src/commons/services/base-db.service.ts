import { Brackets, QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import {
  DuplicateEntityException,
  DuplicateFieldInfo,
} from '../exceptions/duplicate-entity.exception';
import { AppBaseEntity } from '../entities/app-base-entity';

export class BaseDbService<Entity extends AppBaseEntity> {
  async isDuplicateEntity<Dto = { [p: string]: any }>(
    em: Repository<Entity>,
    dto: Dto,
    fields?: Array<keyof Dto & string>,
  ): Promise<false | never> {
    const qb = em.createQueryBuilder();

    const compareFields = BaseDbService.getCompareFields(dto, fields);
    for (const key of compareFields) {
      qb.orWhere(`${key} = :${key}`);
    }
    qb.setParameters(dto);
    return await this.checkDuplicateFields(qb, dto, fields);
  }

  async isDuplicateEntityForUpdate<Dto = { [p: string]: any }>(
    repository: Repository<Entity>,
    id: string,
    dto: Dto,
    fields?: Array<keyof Dto & string>,
  ): Promise<false | never> {
    const qb = repository.createQueryBuilder('entity');
    const compareFields = BaseDbService.getCompareFields(dto, fields);
    if (compareFields.length > 0) {
      qb.andWhere(
        new Brackets((bqb) => {
          for (const key of compareFields) {
            bqb.orWhere(`entity.${key} = :${key}`);
          }
        }),
      );
    } else {
      return false;
    }
    qb.andWhere(`entity.id <> :id`);
    qb.setParameters(Object.assign({}, dto, { id }));
    return await this.checkDuplicateFields(qb, dto, compareFields);
  }

  private static getCompareFields<Dto>(
    dto: Dto,
    fields: Array<keyof Dto & string>,
  ) {
    const compareFields = [];
    for (const key of Object.keys(dto) as Array<keyof Dto & string>) {
      if (!Array.isArray(fields) || fields.includes(key)) {
        compareFields.push(fields);
      }
    }
    return compareFields;
  }

  private async checkDuplicateFields<Dto = { [p: string]: any }>(
    qb: SelectQueryBuilder<Entity>,
    dto: Dto,
    compareFields: Array<keyof Dto & string>,
  ): Promise<false | never> {
    const existingEntity = await qb.getOne();
    if (!existingEntity) {
      return false;
    }
    const duplicateEntityInfo: DuplicateFieldInfo[] = [];
    for (const key of compareFields) {
      if (existingEntity[key as string] === dto[key]) {
        duplicateEntityInfo.push({
          property: key,
          value: dto[key],
        });
      }
    }
    throw new DuplicateEntityException(duplicateEntityInfo);
  }

  protected async getListResult<T>(qb: SelectQueryBuilder<T>) {
    return {
      records: await qb.getMany(),
      count: await qb.getCount(),
    };
  }
}
