import { Test, TestingModule } from '@nestjs/testing';
import { TvdbController } from './tvdb.controller';
import { SharedModule } from '../../../../shared/shared.module';

describe('TvdbController', () => {
  let controller: TvdbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [TvdbController],
    }).compile();

    controller = module.get<TvdbController>(TvdbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
