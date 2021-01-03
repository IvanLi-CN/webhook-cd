import { SelectQueryBuilder } from 'typeorm';

interface PaginationInterface {
  pageSize?: number;
  pageIndex?: number;
  take?: number;
  skip?: number;
}

export class TypeormHelper {
  static pagination<T>(qb: SelectQueryBuilder<T>, params: PaginationInterface) {
    if (!params.take || isNaN(params.take)) {
      if (!params.pageSize || isNaN(params.pageSize)) {
        params.pageSize = 50;
      }
      params.take = params.pageSize;
    }
    if (!params.skip || isNaN(params.skip)) {
      if (!params.pageIndex || isNaN(params.pageIndex)) {
        params.pageIndex = 1;
      }
      params.skip = (params.pageIndex - 1) * params.pageSize;
    }
    if (params.skip) {
      qb.skip(params.skip);
    }
    if (params.take) {
      qb.take(params.take);
    }
  }

  static pagination4Raw<T>(
    qb: SelectQueryBuilder<T>,
    params: PaginationInterface,
  ) {
    if (!params.take || isNaN(params.take)) {
      if (!params.pageSize || isNaN(params.pageSize)) {
        params.pageSize = 15;
      }
      params.take = params.pageSize;
    }
    if (!params.skip || isNaN(params.skip)) {
      if (!params.pageIndex || isNaN(params.pageIndex)) {
        params.pageIndex = 1;
      }
      params.skip = (params.pageIndex - 1) * params.pageSize;
    }
    if (params.skip) {
      qb.offset(params.skip);
    }
    if (params.take) {
      qb.limit(params.take);
    }
  }

  static filterActive<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    params: { isActive?: boolean },
  ) {
    if (params.isActive === true || params.isActive === false) {
      qb.andWhere(`${alias}.isActive = :isActive`, params);
    }
  }

  static filterDeletion<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    params: { isDelete?: boolean; includeDeleted?: boolean },
  ) {
    if (params.isDelete && params.includeDeleted) {
      qb.andWhere(`${alias}.isDelete = true`);
    } else if (params.isDelete === false || !params.includeDeleted) {
      qb.andWhere(`${alias}.isDelete = false`);
    }
  }

  static rangeFilter<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    fieldName: string,
    params,
  ) {
    const beginAt = params[`${fieldName}GT`];
    const endAt = params[`${fieldName}LT`];
    if (beginAt) {
      qb.andWhere(`${alias}.${fieldName} >= :${`${fieldName}GT`}`, {
        [`${fieldName}GT`]: beginAt,
      });
    }
    if (endAt) {
      qb.andWhere(`${alias}.${fieldName} <= :${`${fieldName}LT`}`, {
        [`${fieldName}LT`]: endAt,
      });
    }
  }

  static dateTimeRangeFilter2<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    fieldName: string,
    beginAt: Date,
    endAt: Date,
  ) {
    if (beginAt) {
      qb.andWhere(`${alias}.${fieldName} >= :beginAt`, { beginAt });
    }
    if (endAt) {
      qb.andWhere(`${alias}.${fieldName} <= :endAt`, { endAt });
      qb.andWhere(`${alias}.${fieldName} >= :${fieldName}BeginAt`, {
        [`${fieldName}BeginAt`]: beginAt,
      });
    }
    if (endAt) {
      qb.andWhere(`${alias}.${fieldName} <= :${fieldName}EndAt`, {
        [`${fieldName}EndAt`]: endAt,
      });
    }
  }

  static baseQuery<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    params: {
      isDelete?: boolean;
      includeDeleted?: boolean;
      isActive?: boolean;
    } & PaginationInterface,
  ) {
    this.filterByIds(qb, alias, params);
    this.pagination(qb, params);
    this.filterActive(qb, alias, params);
    this.filterDeletion(qb, alias, params);
  }

  static excludeDeletedRecords<T>(qb: SelectQueryBuilder<T>, alias: string) {
    qb.andWhere(`${alias}.isDelete = FALSE`);
  }

  static filterBoolean<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    params: any,
  ) {
    for (const key of Object.keys(params)) {
      if (params[key] === true || params[key] === false) {
        const sql = `${alias}.${key} = :${key}`;
        qb.andWhere(sql, { [key]: params[key] });
      }
    }
  }

  static filterBooleanWhenExists<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    field: string,
    params: { [field: string]: any },
  ) {
    params[field] !== undefined &&
      params[field] !== null &&
      qb.andWhere(`${alias}.${field} = :${field}`, params);
  }

  static filterEqual<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    field: string,
    params: { [field: string]: any },
  ) {
    params[field] !== undefined &&
      qb.andWhere(`${alias}.${field} = :${field}`, params);
  }

  static sortResults<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    field: string,
    params: { [field: string]: any },
  ) {
    params[`${field}OrderBy`] !== undefined &&
      qb.addOrderBy(`${alias}.${field}`, params[`${field}OrderBy`]);
  }

  static filterLike<T, Conditions>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    field: string & (keyof Conditions | keyof T),
    params: { [f: string]: any },
  ) {
    params[field] &&
      qb.andWhere(`${alias}.${field} LIKE :like-$${field}`, {
        [`like-${field}`]: `%${params[field]}%`,
      });
  }

  static filterLike2<T>(
    qb: SelectQueryBuilder<T>,
    dbField: string,
    pField: string,
    params: { [field: string]: any },
  ) {
    params[pField] &&
      qb.andWhere(`${dbField} LIKE :like-$${pField}`, {
        [`like-${pField}`]: `%${params[pField]}%`,
      });
  }

  static filterLike3<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    field: string,
    params: { [field: string]: any },
  ) {
    params[field] &&
      qb.andWhere(`${alias}.${field} LIKE :like-${field}`, {
        [`like-${field}`]: `${params[field]}%`,
      });
  }

  static filterNameOrRemark<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    params: { [field: string]: any },
    nameField = 'name',
    remarkField = 'remark',
    pField = 'name',
  ) {
    params[pField] &&
      qb.andWhere((qb1) =>
        qb1
          .orWhere(`${nameField} LIKE :${pField}`, {
            [pField]: `%${params[pField]}%`,
          })
          .orWhere(`${remarkField} LIKE :${pField}`, {
            [pField]: `%${params[pField]}%`,
          })
          .getQuery(),
      );
  }

  static filterUserByIdOrName<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    entityName: string,
    params: { [field: string]: any },
  ) {
    TypeormHelper.filterEqual(qb, alias, `${entityName}Id`, params);
    TypeormHelper.filterLike2(
      qb,
      `${entityName}.nick`,
      `${entityName}Name`,
      params,
    );
  }

  static filterUserByIdOrName2<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    entityName: string,
    field = 'name',
    params: { [field: string]: any },
  ) {
    TypeormHelper.filterEqual(qb, alias, `${entityName}Id`, params);
    TypeormHelper.filterLike2(
      qb,
      `${entityName}.${field}`,
      `${entityName}Name`,
      params,
    );
  }

  static filterByIds<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    params: { [field: string]: any },
  ) {
    let ids = Array.isArray(params.ids) ? params.ids : [params.id];
    ids = ids.filter((id) => !!id);
    if (ids.length > 0) {
      qb.andWhereInIds(ids);
    }
  }

  static filterIn<T>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    dbField: string,
    pField: string,
    params: { [field: string]: any },
  ) {
    if (!Array.isArray(params[pField])) {
      return;
    }
    if (params[pField].length > 0) {
      qb.andWhere(`${alias}.${dbField} IN (:...${pField})`, params);
    } else {
      qb.where('1 <> 1');
    }
  }

  static getUserParentIds(user) {
    return user.path.split('/').filter((v) => !!v);
  }
}
