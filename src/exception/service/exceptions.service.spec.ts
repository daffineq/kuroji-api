import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionsService } from './exceptions.service';
import { SharedModule } from '../../shared/shared.module';

describe('ExceptionService', () => {
  let service: ExceptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [ExceptionsService],
    }).compile();

    service = module.get<ExceptionsService>(ExceptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
