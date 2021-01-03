import { Test, TestingModule } from '@nestjs/testing';
import { DeployTasksService } from './deploy-tasks.service';
import { DeployTask } from './deploy-task';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DeployTasksService', () => {
  let service: DeployTasksService;
  const repository = new Repository<DeployTask>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeployTasksService,
        {
          provide: getRepositoryToken(DeployTask),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<DeployTasksService>(DeployTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
