import { Test, TestingModule } from '@nestjs/testing';
import { ToolsService } from './tools.service.js';
import { SharedModule } from '../../../shared/shared.module.js';

describe('ToolsService', () => {
  let service: ToolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();

    service = module.get<ToolsService>(ToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
