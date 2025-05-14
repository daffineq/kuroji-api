import { Test, TestingModule } from '@nestjs/testing';
import { ZoroHelper } from '../utils/zoro-helper';
import { ZoroService } from './zoro.service';
import { SharedModule } from '../../../../shared/shared.module'

jest.setTimeout(30000);

describe('ZoroService', () => {
  let service: ZoroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
            imports: [SharedModule],
            providers: [ZoroService, ZoroHelper],
    }).compile();

    service = module.get<ZoroService>(ZoroService);
  });

  it('fetch info', async () => {
    try {
      const id = 21
      const data = await service.getZoroByAnilist(id)
      expect(data).toBeDefined()
    } catch (err) {
      throw new Error(`Zoro API failed info test: ${err.message}`);
    }
  })

  it('fetch watch', async () => {
    try {
      const id = 21
      const data = await service.getZoroByAnilist(id)
      const watch = await service.getSources(data.episodes[0].id, false)
      expect(watch).toBeDefined()
    } catch (err) {
      throw new Error(`Zoro API failed watch test: ${err.message}`);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
