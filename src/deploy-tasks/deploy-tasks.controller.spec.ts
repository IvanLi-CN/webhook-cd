import { Test, TestingModule } from '@nestjs/testing';
import { DeployTasksController } from './deploy-tasks.controller';

describe('DeployTasksController', () => {
  let controller: DeployTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeployTasksController],
    }).compile();

    controller = module.get<DeployTasksController>(DeployTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
