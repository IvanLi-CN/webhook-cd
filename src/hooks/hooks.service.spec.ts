import { Test, TestingModule } from '@nestjs/testing';
import { HooksService } from './hooks.service';
import { getQueueToken } from '@nestjs/bull';
import { readJSON } from 'fs-extra';
import * as path from 'path';

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

  describe('verifyGithubSignature', () => {
    it('should be true', async () => {
      const obj = await readJSON(
        path.join(__dirname, '../../test/data/github-webhook-payload.json'),
      );
      return expect(
        service.verifyGithubSignature(
          JSON.stringify(obj),
          'sha256=75e7d834e8352f39c96366b30349eb4c2a2d5ba75f9265f6fe32833669e4ec6b',
          '12345678',
        ),
      ).toBeTruthy();
    });
  });
});
