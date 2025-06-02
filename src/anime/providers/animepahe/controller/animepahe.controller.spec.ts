import { Test, TestingModule } from '@nestjs/testing';
import { AnimepaheController } from './animepahe.controller';
import { AnimepaheService } from '../service/animepahe.service';
import { AnimePaheHelper } from '../utils/animepahe-helper';
import { SharedModule } from '../../../../shared/shared.module';

describe('AnimepaheController', () => {
  let controller: AnimepaheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [AnimepaheController],
      providers: [AnimepaheService, AnimePaheHelper],
    }).compile();

    controller = module.get<AnimepaheController>(AnimepaheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
