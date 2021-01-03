import { Test, TestingModule } from '@nestjs/testing';
import { HooksService } from './hooks.service';
import { getQueueToken } from '@nestjs/bull';

describe('HooksService', () => {
  let service: HooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HooksService,
        {
          provide: getQueueToken('deploy'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<HooksService>(HooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
