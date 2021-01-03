import { Test, TestingModule } from '@nestjs/testing';
import { HooksController } from './hooks.controller';
import { HooksService } from './hooks.service';
import { ProjectsService } from '../projects/projects.service';

describe('HooksController', () => {
  let controller: HooksController;
  // let service: HooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HooksController],
      providers: [
        {
          provide: HooksService,
          useValue: {},
        },
        {
          provide: ProjectsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<HooksController>(HooksController);
    // service = module.get<HooksService>(HooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
