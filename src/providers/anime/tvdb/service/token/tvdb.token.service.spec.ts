import { Test, TestingModule } from '@nestjs/testing';
import { TvdbTokenService } from './tvdb.token.service';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from '../../../../../shared/shared.module';

describe('TvdbTokenService', () => {
  let service: TvdbTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, SharedModule],
    }).compile();

    service = module.get<TvdbTokenService>(TvdbTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
