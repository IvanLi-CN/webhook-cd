import { AppBaseEntity } from '../entities/app-base-entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { TypeormHelper } from './typeorm-helper';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  DuplicateEntityException,
  DuplicateFieldInfo,
} from '../exceptions/duplicate-entity.exception';
import { BaseListResDto } from '../dtos/base-list-res.dto';
import { BaseQueryArg } from '../dtos/base-query.arg';

export class BaseDbService<Entity extends AppBaseEntity> extends TypeormHelper {
  constructor(protected readonly repository: Repository<Entity>) {
    super();
  }

  readonly uniqueFields: Array<keyof Entity | Array<keyof Entity>> = [];

  async isDuplicateEntity<Dto extends Entity & Record<string, any>>(
    dto: Partial<Dto>,
    extendsFields: Array<keyof Dto> = [],
  ): Promise<false | never> {
    const qb = this.repository.createQueryBuilder('entity');
    const compareFields = this.getCompareFields(dto, [
      ...this.uniqueFields,
      ...extendsFields,
    ]);
    if (compareFields.length > 0) {
      qb.andWhere(
        new Brackets((bqb) => {
          for (const key of compareFields) {
            if (Array.isArray(key)) {
              bqb.orWhere(
                new Brackets((bbqb) => {
                  for (const k of key) {
                    bbqb.andWhere(`entity.${k} = :${k}`);
                  }
                }),
              );
            } else {
              bqb.orWhere(`entity.${key} = :${key}`);
            }
          }
        }),
      );
    } else {
      return false;
    }
    qb.andWhere(`entity.isDelete = FALSE`);
    qb.setParameters(Object.assign({}, dto));
    const uniqueFields = Array.from(new Set(compareFields.flat()));
    qb.addSelect(uniqueFields.map((f) => `entity.${f} AS entity_${f}`));
    return await this.checkDuplicateFields(qb, dto, uniqueFields);
  }

  async isDuplicateEntityForUpdate<Dto extends Entity>(
    id: string,
    dto: Partial<Dto>,
    extendsFields: Array<keyof Dto & string> = [],
  ): Promise<false | never> {
    const qb = this.repository.createQueryBuilder('entity');
    const compareFields = this.getCompareFields(dto, [
      ...this.uniqueFields,
      ...extendsFields,
    ]);
    const flatCompareFields = compareFields.flat();
    if (compareFields.length > 0) {
      qb.andWhere(
        new Brackets((bqb) => {
          for (const key of compareFields) {
            if (Array.isArray(key)) {
              if (key.length > 0) {
                bqb.orWhere(
                  new Brackets((bbqb) =>
                    key.forEach((k) => {
                      bbqb.andWhere(`entity.${k} = :${k}`);
                    }),
                  ),
                );
              }
            } else {
              bqb.orWhere(`entity.${key} = :${key}`);
            }
          }
        }),
      );
    } else {
      return false;
    }
    qb.andWhere(`entity.id <> :id`);
    qb.andWhere(`entity.isDelete = FALSE`);
    qb.setParameters(Object.assign({}, dto, { id }));
    qb.addSelect(flatCompareFields.map((f) => `entity.${f} AS entity_${f}`));
    return await this.checkDuplicateFields(qb, dto, compareFields);
  }

  async convertFindOneByListEntity(entity) {
    return await entity;
  }

  async listResultConverter(
    qb,
    queryArg: BaseQueryArg,
  ): Promise<BaseListResDto> {
    const [records, count] = await qb.getManyAndCount();
    if (queryArg?.id) {
      const entity = records[0];
      if (entity === undefined) {
        throw new NotFoundException();
      }
      records[0] = await this.convertFindOneByListEntity(entity);
    }
    return { records, count };
  }

  static async listResultConverter(qb): Promise<BaseListResDto> {
    const [records, count] = await qb.getManyAndCount();
    return { records, count };
  }

  async findOne(entity: Entity): Promise<Entity>;
  async findOne(id: number): Promise<Entity>;
  async findOne(idOrEntity: number | Entity): Promise<Entity> {
    if (idOrEntity instanceof Object) {
      return idOrEntity;
    }
    return await this.repository.findOneOrFail({
      where: { id: idOrEntity, isDelete: false },
    });
  }

  checkProperty<T>(
    obj: T,
    field: keyof T,
    whitelist: Array<typeof obj[keyof T]>,
    errMsg: string,
  ) {
    if (!whitelist.some((item) => obj[field] === item)) {
      throw new UnprocessableEntityException(errMsg);
    }
  }

  async canYouRemoveWithIds(ids: string[]): Promise<void> {
    return;
  }

  private getCompareFields<Dto>(
    dto: Partial<Dto>,
    fields: Array<keyof Dto | Array<keyof Dto>>,
  ) {
    if (!Array.isArray(fields)) {
      return [];
    }
    const compareFields = [];
    for (const field of fields as Array<keyof Dto | Array<keyof Dto>>) {
      if (Array.isArray(field)) {
        const tmpFields = [];
        for (const f of field) {
          if (dto[f] !== undefined) {
            tmpFields.push(f);
          }
        }
        compareFields.push(tmpFields);
      } else if (dto[field] !== undefined) {
        compareFields.push(field);
      }
    }
    console.log({ compareFields });
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

  protected async getTotalQueryBuilder(
    qb: SelectQueryBuilder<Entity>,
  ): Promise<SelectQueryBuilder<Entity>> {
    const totalQb = qb.clone();
    totalQb.offset(0).skip(0).take(undefined).limit(undefined);
    return totalQb;
  }

  getUpdateRows(returned: any): number {
    return returned?.affected;
  }

  isFindOne(queryArg): boolean {
    return queryArg.id !== undefined;
  }
}
