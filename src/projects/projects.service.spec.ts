import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './project';
import { Repository } from 'typeorm';

describe('ProjectsService', () => {
  let service: ProjectsService;
  const repository = new Repository<Project>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSecret', () => {
    it('should return a 40-chars string.', () => {
      expect(ProjectsService['generateSecret']()).toMatch(/^\w{40}$/);
    });
  });
});
