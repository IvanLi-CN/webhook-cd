import { Column, Entity } from 'typeorm';
import { GitRepository } from './git-repository.entity';
import { AppBaseEntity } from '../commons/entities/app-base-entity';
import {
  IsEmpty,
  IsObject,
  IsString,
  Max,
  Min,
} from 'class-validator';

@Entity()
export class Project extends AppBaseEntity {
  @IsString()
  @Min(2)
  @Max(32)
  @Column({ length: 32, comment: '名称' })
  name: string;

  @IsObject()
  @Column(() => GitRepository)
  repository: GitRepository;

  @IsString()
  @Max(512)
  @Column({ length: 512, comment: '备注' })
  remarks: string;

  @IsEmpty()
  @Column({ default: false })
  isDelete: boolean;
}
