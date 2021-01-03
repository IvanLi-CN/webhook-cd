import { Test, TestingModule } from '@nestjs/testing';
import { DeployTasksService } from './deploy-tasks.service';

describe('DeployTasksService', () => {
  let service: DeployTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeployTasksService],
    }).compile();

    service = module.get<DeployTasksService>(DeployTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
