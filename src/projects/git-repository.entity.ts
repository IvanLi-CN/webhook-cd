import { Column } from 'typeorm';
import { IsString, MaxLength } from 'class-validator';

export class GitRepository {
  @IsString()
  @MaxLength(256)
  @Column({ length: 256, comment: '完整名称' })
  fullName: string;
  @Column()
  @IsString()
  @MaxLength(512)
  @Column({ length: 512, comment: '仓库地址（SSH）' })
  sshUrl: string;
}
