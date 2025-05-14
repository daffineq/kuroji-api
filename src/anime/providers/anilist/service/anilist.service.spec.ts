import { Test, TestingModule } from '@nestjs/testing';
import { AnilistService } from './anilist.service';
import { AnilistController } from '../controller/anilist.controller'
import { SharedModule } from '../../../../shared/shared.module'

describe('AnilistService', () => {
  let service: AnilistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnilistController],
      imports: [SharedModule],
    }).compile();

    service = module.get<AnilistService>(AnilistService);
  });

  it('fetch info', async () => {
    try {
      const id = 21
      const data = await service.getAnilist(id)
      expect(data).toBeDefined()
    } catch (err) {
      throw new Error(`Anilist API failed info test: ${err.message}`)
    }
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
