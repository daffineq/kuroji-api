import { Test, TestingModule } from '@nestjs/testing';
import { TmdbController } from './tmdb.controller';
import { SharedModule } from '../../../../shared/shared.module';

describe('TmdbController', () => {
  let controller: TmdbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [TmdbController],
    }).compile();

    controller = module.get<TmdbController>(TmdbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
