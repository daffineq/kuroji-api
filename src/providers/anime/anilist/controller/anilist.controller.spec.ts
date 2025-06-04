import { Test, TestingModule } from '@nestjs/testing';
import { AnilistController } from './anilist.controller';
import { SharedModule } from '../../../../shared/shared.module';

describe('AnilistController', () => {
  let controller: AnilistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnilistController],
      imports: [SharedModule],
    }).compile();

    controller = module.get<AnilistController>(AnilistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get anilist', async () => {
    const id = 21;
    const result = await controller.getAnilist(id);
    expect(result).toBeDefined();
    expect(result.id).toEqual(id);
  });
});
